import { useMemo, useState } from "react";
import {
  Avatar,
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
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";

import type { User } from "../types";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/usersService";
import { fetchUserRoles } from "../services/userRoleService";

interface UserForm {
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
}

function UserFormDialog({
  open,
  onClose,
  editing,
  roles,
}: {
  open: boolean;
  onClose: () => void;
  editing: User | null;
  roles: { id: string; name: string }[];
}) {
  const qc = useQueryClient();
  const createMut = useMutation({
    mutationFn: (d: UserForm) => createUser(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      onClose();
    },
  });
  const updateMut = useMutation({
    mutationFn: (d: UserForm) => updateUser(editing!.id, d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      onClose();
    },
  });

  const form = useForm({
    defaultValues: editing
      ? {
          firstName: editing.firstName,
          lastName: editing.lastName,
          email: editing.email,
          roleId: editing.roleId,
        }
      : { firstName: "", lastName: "", email: "", roleId: "" },
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
        {editing ? "Edit User" : "New User"}
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
          <Stack direction="row" spacing={2}>
            <form.Field
              name="firstName"
              validators={{
                onChange: ({ value }) =>
                  !value.trim() ? "Required" : undefined,
              }}
            >
              {(f) => (
                <TextField
                  label="First Name"
                  size="small"
                  sx={{ flex: 1 }}
                  value={f.state.value}
                  onChange={(e) => f.handleChange(e.target.value)}
                  onBlur={f.handleBlur}
                  error={!!f.state.meta.errors.length}
                  helperText={f.state.meta.errors[0] ?? " "}
                />
              )}
            </form.Field>
            <form.Field
              name="lastName"
              validators={{
                onChange: ({ value }) =>
                  !value.trim() ? "Required" : undefined,
              }}
            >
              {(f) => (
                <TextField
                  label="Last Name"
                  size="small"
                  sx={{ flex: 1 }}
                  value={f.state.value}
                  onChange={(e) => f.handleChange(e.target.value)}
                  onBlur={f.handleBlur}
                  error={!!f.state.meta.errors.length}
                  helperText={f.state.meta.errors[0] ?? " "}
                />
              )}
            </form.Field>
          </Stack>
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                if (!value.trim()) return "Email is required";
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                  return "Invalid email";
                return undefined;
              },
            }}
          >
            {(f) => (
              <TextField
                label="Email"
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
          <form.Field
            name="roleId"
            validators={{
              onChange: ({ value }) =>
                !value ? "Role is required" : undefined,
            }}
          >
            {(f) => (
              <FormControl
                size="small"
                fullWidth
                error={!!f.state.meta.errors.length}
              >
                <InputLabel>Role</InputLabel>
                <Select
                  value={f.state.value}
                  label="Role"
                  onChange={(e) => f.handleChange(e.target.value)}
                  onBlur={f.handleBlur}
                >
                  {roles.map((r) => (
                    <MenuItem key={r.id} value={r.id}>
                      {r.name}
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

export default function Users() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["users", { page: page + 1, pageSize, search }],
    queryFn: () => fetchUsers({ page: page + 1, pageSize, search }),
    placeholderData: keepPreviousData,
  });
  const rolesQ = useQuery({ queryKey: ["userRoles"], queryFn: fetchUserRoles });
  const roles = rolesQ.data ?? [];

  const deleteMut = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        id: "name",
        header: "Name",
        Cell: ({ row }) => (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar
              src={row.original.avatar}
              sx={{ width: 30, height: 30, fontSize: 12 }}
            >
              {row.original.firstName[0]}
              {row.original.lastName[0]}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {row.original.firstName} {row.original.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {row.original.email}
              </Typography>
            </Box>
          </Stack>
        ),
      },
      {
        accessorKey: "roleId",
        header: "Role",
        Cell: ({ row }) => {
          const role = roles.find((r) => r.id === row.original.roleId);
          return <Typography variant="body2">{role?.name ?? "-"}</Typography>;
        },
      },
      {
        accessorKey: "createdAt",
        header: "Joined",
        Cell: ({ row }) => (
          <Typography variant="body2">
            {new Date(row.original.createdAt).toLocaleDateString()}
          </Typography>
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
    [roles],
  );

  const table = useMaterialReactTable({
    columns,
    data: query.data?.items ?? [],
    manualPagination: true,
    rowCount: query.data?.total ?? 0,
    initialState: { sorting: [{ id: "createdAt", desc: true }] },
    state: {
      pagination: { pageIndex: page, pageSize },
      isLoading: query.isLoading,
      globalFilter: search,
    },
    onPaginationChange: (u) => {
      const n = typeof u === "function" ? u({ pageIndex: page, pageSize }) : u;
      setPage(n.pageIndex);
      setPageSize(n.pageSize);
    },
    onGlobalFilterChange: (v: string) => {
      setSearch(v);
      setPage(0);
    },
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
        New User
      </Button>
    ),
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5" fontWeight={700}>
        Users
      </Typography>
      <MaterialReactTable table={table} />
      <UserFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        editing={editing}
        roles={roles}
      />
    </Box>
  );
}
