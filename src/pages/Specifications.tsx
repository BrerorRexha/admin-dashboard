import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  AddOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@mui/icons-material";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";

import type { Specification } from "../types";
import {
  fetchSpecifications,
  createSpecification,
  updateSpecification,
  deleteSpecification,
} from "../services/specificationService";
import { fetchCategories } from "../services/categoryService";

interface SpecForm {
  name: string;
  categoryId: string;
}

function SpecFormDialog({
  open,
  onClose,
  editing,
  categories,
}: {
  open: boolean;
  onClose: () => void;
  editing: Specification | null;
  categories: { id: string; slug: string }[];
}) {
  const qc = useQueryClient();
  const createMut = useMutation({
    mutationFn: (d: SpecForm) => createSpecification(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["specifications"] });
      onClose();
    },
  });
  const updateMut = useMutation({
    mutationFn: (d: SpecForm) => updateSpecification(editing!.id, d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["specifications"] });
      onClose();
    },
  });

  const form = useForm({
    defaultValues: editing
      ? { name: editing.name, categoryId: editing.categoryId }
      : { name: "", categoryId: "" },
    onSubmit: async ({ value }) => {
      if (editing) await updateMut.mutateAsync(value);
      else await createMut.mutateAsync(value);
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {editing ? "Edit Specification" : "New Specification"}
        <IconButton size="small" onClick={onClose}>
          <CloseOutlined fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            paddingTop: 8,
          }}
        >
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) =>
                !value.trim() ? "Name is required" : undefined,
            }}
          >
            {(f) => (
              <TextField
                label="Name"
                fullWidth
                size="small"
                placeholder="e.g. Color, Size"
                value={f.state.value}
                onChange={(e) => f.handleChange(e.target.value)}
                onBlur={f.handleBlur}
                error={!!f.state.meta.errors.length}
                helperText={f.state.meta.errors[0] ?? " "}
              />
            )}
          </form.Field>
          <form.Field
            name="categoryId"
            validators={{
              onChange: ({ value }) =>
                !value ? "Category is required" : undefined,
            }}
          >
            {(f) => (
              <FormControl
                size="small"
                fullWidth
                error={!!f.state.meta.errors.length}
              >
                <InputLabel>Category</InputLabel>
                <Select
                  value={f.state.value}
                  label="Category"
                  onChange={(e) => f.handleChange(e.target.value)}
                  onBlur={f.handleBlur}
                >
                  {categories.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.slug}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{f.state.meta.errors[0] ?? " "}</FormHelperText>
              </FormControl>
            )}
          </form.Field>
          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMut.isPending || updateMut.isPending}
            >
              {editing ? "Save" : "Create"}
            </Button>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Specifications() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Specification | null>(null);
  const [search, setSearch] = useState("");
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["specifications", { search }],
    queryFn: () => fetchSpecifications({ search }),
  });
  const categoriesQ = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });
  const categories = categoriesQ.data?.items ?? [];

  const deleteMut = useMutation({
    mutationFn: deleteSpecification,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["specifications"] }),
  });

  const columns = useMemo<MRT_ColumnDef<Specification>[]>(
    () => [
      { accessorKey: "name", header: "Name" },
      {
        accessorKey: "categoryId",
        header: "Category",
        Cell: ({ row }) => {
          const cat = categories.find((c) => c.id === row.original.categoryId);
          return <Typography variant="body2">{cat?.slug ?? "-"}</Typography>;
        },
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        Cell: ({ row }) => (
          <Stack direction="row" spacing={0.5}>
            <IconButton
              size="small"
              onClick={() => {
                setEditing(row.original);
                setDialogOpen(true);
              }}
            >
              <EditOutlined fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => deleteMut.mutate(row.original.id)}
            >
              <DeleteOutlined fontSize="small" />
            </IconButton>
          </Stack>
        ),
      },
    ],
    [categories],
  );

  const table = useMaterialReactTable({
    columns,
    data: query.data?.items ?? [],
    state: { isLoading: query.isLoading, globalFilter: search },
    onGlobalFilterChange: (v: string) => setSearch(v),
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    muiTablePaperProps: {
      elevation: 0,
      sx: { border: "1px solid", borderColor: "divider", borderRadius: 2 },
    },
    renderTopToolbarCustomActions: () => (
      <Button
        variant="contained"
        size="small"
        startIcon={<AddOutlined />}
        onClick={() => {
          setEditing(null);
          setDialogOpen(true);
        }}
      >
        New Specification
      </Button>
    ),
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5" fontWeight={700}>
        Specifications
      </Typography>
      <MaterialReactTable table={table} />
      <SpecFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        editing={editing}
        categories={categories}
      />
    </Box>
  );
}
