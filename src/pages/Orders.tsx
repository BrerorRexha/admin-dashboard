import { Box, MenuItem, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "../components/table/DataTable";
import type { Order } from "../types/order";
import { fetchOrders } from "../services/ordersService";

export default function Orders() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const query = useQuery({
    queryKey: ["orders", { page, pageSize, status, search }],
    queryFn: () => fetchOrders({ page, pageSize, status: status as any, search }),
    placeholderData: keepPreviousData
  });

  const columns = useMemo<ColumnDef<Order>[]>(() => {
    return [
      { header: "Order", accessorKey: "orderNumber" },
      { header: "Status", accessorKey: "status" },
      { header: "Total", cell: ctx => `${ctx.row.original.total.toFixed(2)} ${ctx.row.original.currency}` },
      { header: "Created", cell: ctx => new Date(ctx.row.original.createdAt).toLocaleString() }
    ];
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5">Orders</Typography>

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
          label="Status"
          value={status}
          onChange={e => {
            setPage(1);
            setStatus(e.target.value);
          }}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="paid">Paid</MenuItem>
          <MenuItem value="processing">Processing</MenuItem>
          <MenuItem value="shipped">Shipped</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </TextField>
      </Box>

      <DataTable<Order>
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