import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "../components/table/DataTable";
import type { User } from "../types/user";
import { fetchUsers } from "../services/usersService";
import { useAuth } from "../app/auth";

export default function Users() {
  const { can } = useAuth();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const query = useQuery({
    queryKey: ["users", { page, pageSize, search, role }],
    queryFn: () => fetchUsers({ page, pageSize, search, role }),
    // keepPreviousData: true
  });

  const columns = useMemo<ColumnDef<User>[]>(() => {
    return [
      { header: "Name", cell: ctx => `${ctx.row.original.firstName} ${ctx.row.original.lastName}` },
      { header: "Email", accessorKey: "email" },
      { header: "Role", accessorKey: "role" },
      { header: "Status", accessorKey: "status" },
      { header: "Created", cell: ctx => new Date(ctx.row.original.createdAt).toLocaleDateString() }
    ];
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
        <Typography variant="h5">Users</Typography>
        <Button variant="contained" disabled={!can("users.write")}>
          Create user
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          size="small"
          label="Search"
          value={search}
          onChange={e => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        <TextField
          size="small"
          select
          label="Role"
          value={role}
          onChange={e => {
            setPage(1);
            setRole(e.target.value);
          }}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="support">Support</MenuItem>
          <MenuItem value="viewer">Viewer</MenuItem>
        </TextField>
      </Box>

      <DataTable<User>
        columns={columns}
        rows={query.data?.items ?? []}
        total={query.data?.total ?? 0}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={n => {
          setPage(1);
          setPageSize(n);
        }}
      />
    </Box>
  );
}