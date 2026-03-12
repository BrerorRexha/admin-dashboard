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

import type { SpecValue } from "../types";
import {
  fetchSpecValues,
  createSpecValue,
  updateSpecValue,
  deleteSpecValue,
} from "../services/specValueService";
import { fetchSpecifications } from "../services/specificationService";

interface SVForm {
  value: string;
  specificationId: string;
}

function SVFormDialog({
  open,
  onClose,
  editing,
  specs,
}: {
  open: boolean;
  onClose: () => void;
  editing: SpecValue | null;
  specs: { id: string; name: string; categoryId: string }[];
}) {
  const qc = useQueryClient();
  const createMut = useMutation({
    mutationFn: (d: SVForm) => createSpecValue(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["specValues"] });
      onClose();
    },
  });
  const updateMut = useMutation({
    mutationFn: (d: SVForm) => updateSpecValue(editing!.id, d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["specValues"] });
      onClose();
    },
  });

  const form = useForm({
    defaultValues: editing
      ? { value: editing.value, specificationId: editing.specificationId }
      : { value: "", specificationId: "" },
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
        {editing ? "Edit Spec Value" : "New Spec Value"}
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
            name="specificationId"
            validators={{
              onChange: ({ value }) =>
                !value ? "Specification is required" : undefined,
            }}
          >
            {(f) => (
              <FormControl
                size="small"
                fullWidth
                error={!!f.state.meta.errors.length}
              >
                <InputLabel>Specification</InputLabel>
                <Select
                  value={f.state.value}
                  label="Specification"
                  onChange={(e) => f.handleChange(e.target.value)}
                  onBlur={f.handleBlur}
                >
                  {specs.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{f.state.meta.errors[0] ?? " "}</FormHelperText>
              </FormControl>
            )}
          </form.Field>
          <form.Field
            name="value"
            validators={{
              onChange: ({ value }) =>
                !value.trim() ? "Value is required" : undefined,
            }}
          >
            {(f) => (
              <TextField
                label="Value"
                fullWidth
                size="small"
                placeholder="e.g. Red, XL, 256GB"
                value={f.state.value}
                onChange={(e) => f.handleChange(e.target.value)}
                onBlur={f.handleBlur}
                error={!!f.state.meta.errors.length}
                helperText={f.state.meta.errors[0] ?? " "}
              />
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

export default function SpecValues() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SpecValue | null>(null);
  const [search, setSearch] = useState("");
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["specValues", { search }],
    queryFn: () => fetchSpecValues({ search }),
  });
  const specsQ = useQuery({
    queryKey: ["specifications"],
    queryFn: () => fetchSpecifications(),
  });
  const specs = specsQ.data?.items ?? [];

  const deleteMut = useMutation({
    mutationFn: deleteSpecValue,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["specValues"] }),
  });

  const columns = useMemo<MRT_ColumnDef<SpecValue>[]>(
    () => [
      { accessorKey: "value", header: "Value" },
      {
        accessorKey: "specificationId",
        header: "Specification",
        Cell: ({ row }) => {
          const sp = specs.find((s) => s.id === row.original.specificationId);
          return <Typography variant="body2">{sp?.name ?? "-"}</Typography>;
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
    [specs],
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
        New Spec Value
      </Button>
    ),
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5" fontWeight={700}>
        Spec Values
      </Typography>
      <MaterialReactTable table={table} />
      <SVFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        editing={editing}
        specs={specs}
      />
    </Box>
  );
}
