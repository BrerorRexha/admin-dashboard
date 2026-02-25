import { Box, MenuItem, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "../components/table/DataTable";
import type { Product } from "../types/product";
import { fetchProducts } from "../services/productsService";

export default function Products() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  const query = useQuery({
    queryKey: ["products", { page, pageSize, category, search }],
    queryFn: () =>
      fetchProducts({
        page,
        pageSize,
        category: category as any,
        name: search,
      }),
    placeholderData: keepPreviousData,
  });

  const columns = useMemo<ColumnDef<Product>[]>(() => {
    return [
      { header: "Product", accessorKey: "name" },
      { header: "Category", accessorKey: "category" },
      {
        header: "Price",
        cell: (ctx) => `$${ctx.row.original.price.toFixed(2)}`,
      },
      { header: "Stock", accessorKey: "stock" },
      { header: "Status", accessorKey: "status" },
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
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        <TextField
          size="small"
          select
          label="Category"
          value={category}
          onChange={(e) => {
            setPage(1);
            setCategory(e.target.value);
          }}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Electronics">Electronics</MenuItem>
          <MenuItem value="Furniture">Furniture</MenuItem>
          <MenuItem value="Digital">Digital</MenuItem>
        </TextField>
      </Box>

      <DataTable<Product>
        columns={columns}
        rows={query.data?.items ?? []}
        total={query.data?.total ?? 0}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(n) => {
          setPage(1);
          setPageSize(n);
        }}
      />
    </Box>
  );
}
