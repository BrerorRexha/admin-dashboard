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

import type { Category } from "../types";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";

interface CatForm {
  name: string;
  parentId: string;
}

function CategoryFormDialog({
  open,
  onClose,
  editing,
  allCategories,
}: {
  open: boolean;
  onClose: () => void;
  editing: Category | null;
  allCategories: Category[];
}) {
  const qc = useQueryClient();
  const createMut = useMutation({
    mutationFn: (d: CatForm) =>
      createCategory({ name: d.name, parentId: d.parentId || null }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      onClose();
    },
  });
  const updateMut = useMutation({
    mutationFn: (d: CatForm) =>
      updateCategory(editing!.id, {
        name: d.name,
        parentId: d.parentId || null,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      onClose();
    },
  });

  const form = useForm({
    defaultValues: editing
      ? { name: editing.name, parentId: editing.parentId ?? "" }
      : { name: "", parentId: "" },
    onSubmit: async ({ value }) => {
      if (editing) await updateMut.mutateAsync(value);
      else await createMut.mutateAsync(value);
    },
  });

  const eligible = allCategories.filter((c) => c.id !== editing?.id);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {editing ? "Edit Category" : "New Category"}
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
                value={f.state.value}
                onChange={(e) => f.handleChange(e.target.value)}
                onBlur={f.handleBlur}
                error={!!f.state.meta.errors.length}
                helperText={f.state.meta.errors[0] ?? " "}
              />
            )}
          </form.Field>
          <form.Field name="parentId">
            {(f) => (
              <FormControl size="small" fullWidth>
                <InputLabel>Parent Category (optional)</InputLabel>
                <Select
                  value={f.state.value}
                  label="Parent Category (optional)"
                  onChange={(e) => f.handleChange(e.target.value)}
                >
                  <MenuItem value="">None (top level)</MenuItem>
                  {eligible.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.slug}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText> </FormHelperText>
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

export default function Categories() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [search, setSearch] = useState("");
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["categories", { search }],
    queryFn: () => fetchCategories({ search }),
  });
  const all = query.data?.items ?? [];

  const deleteMut = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });

  const columns = useMemo<MRT_ColumnDef<Category>[]>(
    () => [
      { accessorKey: "name", header: "Name" },
      {
        accessorKey: "parentId",
        header: "Parent",
        Cell: ({ row }) => {
          const p = all.find((c) => c.id === row.original.parentId);
          return (
            <Typography variant="body2">{p ? p.name : "\u2014"}</Typography>
          );
        },
      },
      { accessorKey: "slug", header: "Slug" },
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
    [all],
  );

  const table = useMaterialReactTable({
    columns,
    data: all,
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
        New Category
      </Button>
    ),
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5" fontWeight={700}>
        Categories
      </Typography>
      <MaterialReactTable table={table} />
      <CategoryFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        editing={editing}
        allCategories={all}
      />
    </Box>
  );
}
