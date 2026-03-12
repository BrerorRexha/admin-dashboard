import { useMemo, useState } from "react";
import {
  Box,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { EditOutlined } from "@mui/icons-material";
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

import type { Order, OrderStatus } from "../types";
import { fetchOrders, updateOrderStatus } from "../services/ordersService";

const STATUS_COLORS: Record<OrderStatus, "warning" | "info" | "success"> = {
  processing: "warning",
  processed: "info",
  delivered: "success",
};
const STATUS_LABEL: Record<OrderStatus, string> = {
  processing: "Processing",
  processed: "Processed",
  delivered: "Delivered",
};

function OrderStatusChip({ status }: { status: OrderStatus }) {
  return (
    <Chip
      label={STATUS_LABEL[status]}
      color={STATUS_COLORS[status]}
      size="small"
      variant="outlined"
    />
  );
}

function StatusEditor({ order }: { order: Order }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const mut = useMutation({
    mutationFn: (status: OrderStatus) => updateOrderStatus(order.id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      setOpen(false);
    },
  });

  if (!open) {
    return (
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <OrderStatusChip status={order.status} />
        <IconButton size="small" onClick={() => setOpen(true)}>
          <EditOutlined sx={{ fontSize: 14 }} />
        </IconButton>
      </Stack>
    );
  }

  return (
    <FormControl size="small" sx={{ minWidth: 140 }}>
      <InputLabel>Status</InputLabel>
      <Select
        value={order.status}
        label="Status"
        onChange={(e) => mut.mutate(e.target.value as OrderStatus)}
        autoFocus
        onBlur={() => setOpen(false)}
      >
        <MenuItem value="processing">Processing</MenuItem>
        <MenuItem value="processed">Processed</MenuItem>
        <MenuItem value="delivered">Delivered</MenuItem>
      </Select>
    </FormControl>
  );
}

export default function Orders() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [search, setSearch] = useState("");

  const query = useQuery({
    queryKey: [
      "orders",
      { page: page + 1, pageSize, status: statusFilter, search },
    ],
    queryFn: () =>
      fetchOrders({ page: page + 1, pageSize, status: statusFilter, search }),
    placeholderData: keepPreviousData,
  });

  const columns = useMemo<MRT_ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: "orderNumber",
        header: "Order",
        Cell: ({ row }) => (
          <Typography variant="body2" fontWeight={600}>
            {row.original.orderNumber}
          </Typography>
        ),
      },
      { accessorKey: "customerName", header: "Customer" },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ row }) => <StatusEditor order={row.original} />,
      },
      {
        accessorKey: "total",
        header: "Total",
        Cell: ({ row }) => (
          <Typography variant="body2">
            \u20AC{row.original.total.toFixed(2)}
          </Typography>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        Cell: ({ row }) => (
          <Typography variant="body2">
            {new Date(row.original.createdAt).toLocaleDateString()}
          </Typography>
        ),
      },
    ],
    [],
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
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Filter by status</InputLabel>
        <Select
          value={statusFilter}
          label="Filter by status"
          onChange={(e) => {
            setStatusFilter(e.target.value as OrderStatus | "");
            setPage(0);
          }}
        >
          <MenuItem value="">All statuses</MenuItem>
          <MenuItem value="processing">Processing</MenuItem>
          <MenuItem value="processed">Processed</MenuItem>
          <MenuItem value="delivered">Delivered</MenuItem>
        </Select>
      </FormControl>
    ),
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5" fontWeight={700}>
        Orders
      </Typography>
      <MaterialReactTable table={table} />
    </Box>
  );
}
