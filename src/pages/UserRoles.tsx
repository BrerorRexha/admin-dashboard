import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
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
import { useForm, useStore } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";

import { type Permission, type UserRole } from "../types";
import {
  fetchUserRoles,
  createUserRole,
  updateUserRole,
  deleteUserRole,
} from "../services/userRoleService";

// Group permissions for better UX
const PERMISSION_GROUPS: { group: string; perms: Permission[] }[] = [
  { group: "Analytics", perms: ["analytics.read"] },
  {
    group: "Products",
    perms: ["products.read", "products.write", "products.delete"],
  },
  { group: "Orders", perms: ["orders.read", "orders.write"] },
  { group: "Categories", perms: ["categories.read", "categories.write"] },
  {
    group: "Specifications",
    perms: ["specifications.read", "specifications.write"],
  },
  { group: "Users", perms: ["users.read", "users.write"] },
  { group: "Roles", perms: ["roles.read", "roles.write"] },
];

interface RoleForm {
  name: string;
  permissions: Permission[];
}

function RoleFormDialog({
  open,
  onClose,
  editing,
}: {
  open: boolean;
  onClose: () => void;
  editing: UserRole | null;
}) {
  const qc = useQueryClient();
  const createMut = useMutation({
    mutationFn: (d: RoleForm) => createUserRole(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userRoles"] });
      onClose();
    },
  });
  const updateMut = useMutation({
    mutationFn: (d: RoleForm) => updateUserRole(editing!.id, d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userRoles"] });
      onClose();
    },
  });

  const form = useForm({
    defaultValues: editing
      ? { name: editing.name, permissions: [...editing.permissions] }
      : { name: "", permissions: [] },
    onSubmit: async ({ value }) => {
      if (editing) await updateMut.mutateAsync(value);
      else await createMut.mutateAsync(value);
    },
  });

  const watchedPerms = useStore(form.store, (s) => s.values.permissions);

  function toggle(perm: Permission) {
    const has = watchedPerms.includes(perm);
    form.setFieldValue(
      "permissions",
      has ? watchedPerms.filter((p) => p !== perm) : [...watchedPerms, perm],
    );
  }

  function toggleGroup(perms: Permission[]) {
    const allSelected = perms.every((p) => watchedPerms.includes(p));
    if (allSelected) {
      form.setFieldValue(
        "permissions",
        watchedPerms.filter((p) => !perms.includes(p)),
      );
    } else {
      const merged = Array.from(new Set([...watchedPerms, ...perms]));
      form.setFieldValue("permissions", merged);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {editing ? "Edit Role" : "New Role"}
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
                label="Role Name"
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

          <Box>
            <Typography variant="subtitle2" mb={1}>
              Permissions
            </Typography>
            {PERMISSION_GROUPS.map((group, gi) => {
              const allSelected = group.perms.every((p) =>
                watchedPerms.includes(p),
              );
              const someSelected = group.perms.some((p) =>
                watchedPerms.includes(p),
              );
              return (
                <Box key={group.group}>
                  {gi > 0 && <Divider sx={{ my: 1 }} />}
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={allSelected}
                        indeterminate={someSelected && !allSelected}
                        onChange={() => toggleGroup(group.perms)}
                      />
                    }
                    label={
                      <Typography variant="body2" fontWeight={600}>
                        {group.group}
                      </Typography>
                    }
                  />
                  <FormGroup sx={{ pl: 3 }}>
                    {group.perms.map((perm) => (
                      <FormControlLabel
                        key={perm}
                        control={
                          <Checkbox
                            size="small"
                            checked={watchedPerms.includes(perm)}
                            onChange={() => toggle(perm)}
                          />
                        }
                        label={
                          <Typography variant="body2" color="text.secondary">
                            {perm}
                          </Typography>
                        }
                      />
                    ))}
                  </FormGroup>
                </Box>
              );
            })}
          </Box>

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

export default function UserRoles() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<UserRole | null>(null);
  const qc = useQueryClient();

  const query = useQuery({ queryKey: ["userRoles"], queryFn: fetchUserRoles });
  const roles = query.data ?? [];
  const deleteMut = useMutation({
    mutationFn: deleteUserRole,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["userRoles"] }),
  });

  const columns = useMemo<MRT_ColumnDef<UserRole>[]>(
    () => [
      { accessorKey: "name", header: "Name" },
      {
        accessorKey: "permissions",
        header: "Permissions",
        Cell: ({ row }) => (
          <Stack direction="row" flexWrap="wrap" gap={0.5}>
            {row.original.permissions.slice(0, 4).map((p) => (
              <Chip key={p} label={p} size="small" variant="outlined" />
            ))}
            {row.original.permissions.length > 4 && (
              <Chip
                label={`+${row.original.permissions.length - 4} more`}
                size="small"
              />
            )}
          </Stack>
        ),
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
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: roles,
    state: { isLoading: query.isLoading },
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
        New Role
      </Button>
    ),
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5" fontWeight={700}>
        User Roles
      </Typography>
      <MaterialReactTable table={table} />
      <RoleFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        editing={editing}
      />
    </Box>
  );
}
