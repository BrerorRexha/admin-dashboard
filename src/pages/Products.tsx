import { useMemo, useState, useRef } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
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
import { useForm, useStore } from "@tanstack/react-form";
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

import type { Product } from "../types";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productsService";
import { fetchCategories } from "../services/categoryService";
import { fetchSpecifications } from "../services/specificationService";
import { fetchSpecValues } from "../services/specValueService";

function StatusChip({ status }: { status: Product["status"] }) {
  return (
    <Chip
      label={status === "in_stock" ? "In Stock" : "Out of Stock"}
      color={status === "in_stock" ? "success" : "error"}
      size="small"
    />
  );
}

interface ProductFormValues {
  name: string;
  description: string;
  stock: string;
  price: string;
  images: string[];
  categoryId: string;
  specValues: string[];
}

const defaultValues: ProductFormValues = {
  name: "",
  description: "",
  stock: "",
  price: "",
  images: [],
  categoryId: "",
  specValues: [],
};

function toFormValues(p: Product): ProductFormValues {
  return {
    name: p.name,
    description: p.description,
    stock: String(p.stock),
    price: String(p.price),
    images: [...p.images],
    categoryId: p.categoryId,
    specValues: [...p.specValues],
  };
}

function ProductFormDialog({
  open,
  onClose,
  editing,
}: {
  open: boolean;
  onClose: () => void;
  editing: Product | null;
}) {
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categoriesQ = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });
  const categories = categoriesQ.data?.items ?? [];

  const createMut = useMutation({
    mutationFn: (data: ProductFormValues) =>
      createProduct({
        name: data.name,
        description: data.description,
        stock: Number(data.stock),
        price: Number(data.price),
        images: data.images,
        categoryId: data.categoryId,
        specValues: data.specValues,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      onClose();
    },
  });
  const updateMut = useMutation({
    mutationFn: (data: ProductFormValues) =>
      updateProduct(editing!.id, {
        name: data.name,
        description: data.description,
        stock: Number(data.stock),
        price: Number(data.price),
        images: data.images,
        categoryId: data.categoryId,
        specValues: data.specValues,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      onClose();
    },
  });

  const form = useForm({
    defaultValues: editing ? toFormValues(editing) : defaultValues,
    onSubmit: async ({ value }) => {
      if (editing) await updateMut.mutateAsync(value);
      else await createMut.mutateAsync(value);
    },
  });

  const watchedCategoryId = useStore(form.store, (s) => s.values.categoryId);
  const watchedImages = useStore(form.store, (s) => s.values.images);
  const watchedSpecValues = useStore(form.store, (s) => s.values.specValues);

  const specsQ = useQuery({
    queryKey: ["specifications", watchedCategoryId],
    queryFn: () => fetchSpecifications({ categoryId: watchedCategoryId }),
    enabled: !!watchedCategoryId,
  });
  const specs = specsQ.data?.items ?? [];

  const specValuesQ = useQuery({
    queryKey: ["specValues", "forCategory", watchedCategoryId],
    queryFn: async () => {
      const results = await Promise.all(
        specs.map((sp) => fetchSpecValues({ specificationId: sp.id })),
      );
      return results.flatMap((r) => r.items);
    },
    enabled: specs.length > 0,
  });
  const allSpecValues = specValuesQ.data ?? [];

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const current = form.getFieldValue("images");
    if (current.length >= 4) return;
    const toRead = files.slice(0, 4 - current.length);
    Promise.all(
      toRead.map(
        (f) =>
          new Promise<string>((res) => {
            const r = new FileReader();
            r.onload = () => res(r.result as string);
            r.readAsDataURL(f);
          }),
      ),
    ).then((urls) => {
      form.setFieldValue("images", [...current, ...urls]);
    });
    e.target.value = "";
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
        {editing ? "Edit Product" : "New Product"}
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

          <form.Field
            name="description"
            validators={{
              onChange: ({ value }) =>
                !value.trim() ? "Description is required" : undefined,
            }}
          >
            {(f) => (
              <TextField
                label="Description"
                fullWidth
                size="small"
                multiline
                rows={3}
                value={f.state.value}
                onChange={(e) => f.handleChange(e.target.value)}
                onBlur={f.handleBlur}
                error={!!f.state.meta.errors.length}
                helperText={f.state.meta.errors[0] ?? " "}
              />
            )}
          </form.Field>

          <Stack direction="row" spacing={2}>
            <form.Field
              name="stock"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return "Stock is required";
                  if (!/^\d+$/.test(value)) return "Whole numbers only";
                  return undefined;
                },
              }}
            >
              {(f) => (
                <TextField
                  label="Stock"
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
              name="price"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return "Price is required";
                  if (!/^\d+(\.\d{1,2})?$/.test(value)) return "e.g. 9.99";
                  return undefined;
                },
              }}
            >
              {(f) => (
                <TextField
                  label={"Price (\u20AC)"}
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
                  onChange={(e) => {
                    f.handleChange(e.target.value);
                    form.setFieldValue("specValues", []);
                  }}
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

          {specs.length > 0 && (
            <Box>
              <FormLabel sx={{ fontSize: "0.75rem", mb: 1, display: "block" }}>
                Specifications
              </FormLabel>
              {specs.map((spec) => (
                <Box key={spec.id} mb={1}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    mb={0.5}
                  >
                    {spec.name}
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={0.5}>
                    {allSpecValues
                      .filter((v) => v.specificationId === spec.id)
                      .map((sv) => {
                        const sel = watchedSpecValues.includes(sv.id);
                        return (
                          <Chip
                            key={sv.id}
                            label={sv.value}
                            size="small"
                            color={sel ? "primary" : "default"}
                            variant={sel ? "filled" : "outlined"}
                            onClick={() =>
                              form.setFieldValue(
                                "specValues",
                                sel
                                  ? watchedSpecValues.filter(
                                      (id) => id !== sv.id,
                                    )
                                  : [...watchedSpecValues, sv.id],
                              )
                            }
                            sx={{ cursor: "pointer" }}
                          />
                        );
                      })}
                  </Stack>
                </Box>
              ))}
            </Box>
          )}

          <form.Field
            name="images"
            validators={{
              onChange: ({ value }) =>
                value.length === 0
                  ? "At least one image is required"
                  : undefined,
            }}
          >
            {(f) => (
              <Box>
                <FormLabel
                  sx={{ fontSize: "0.75rem", mb: 1, display: "block" }}
                >
                  Images (up to 4)
                </FormLabel>
                <Stack direction="row" flexWrap="wrap" gap={1} mb={1}>
                  {watchedImages.map((src, i) => (
                    <Box key={i} sx={{ position: "relative" }}>
                      <Box
                        component="img"
                        src={src}
                        sx={{
                          width: 72,
                          height: 72,
                          objectFit: "cover",
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() =>
                          f.handleChange(
                            watchedImages.filter((_, j) => j !== i),
                          )
                        }
                        sx={{
                          position: "absolute",
                          top: -6,
                          right: -6,
                          bgcolor: "error.main",
                          color: "#fff",
                          p: 0.3,
                          "&:hover": { bgcolor: "error.dark" },
                        }}
                      >
                        <CloseOutlined sx={{ fontSize: 12 }} />
                      </IconButton>
                    </Box>
                  ))}
                  {watchedImages.length < 4 && (
                    <Box
                      onClick={() => fileInputRef.current?.click()}
                      sx={{
                        width: 72,
                        height: 72,
                        border: "2px dashed",
                        borderColor: "divider",
                        borderRadius: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "text.secondary",
                        "&:hover": {
                          borderColor: "primary.main",
                          color: "primary.main",
                        },
                      }}
                    >
                      <AddOutlined />
                    </Box>
                  )}
                </Stack>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleImageUpload}
                />
                {f.state.meta.errors.length > 0 && (
                  <FormHelperText error>
                    {f.state.meta.errors[0]}
                  </FormHelperText>
                )}
              </Box>
            )}
          </form.Field>

          <Stack direction="row" justifyContent="flex-end" spacing={1} pt={1}>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMut.isPending || updateMut.isPending}
            >
              {editing ? "Save Changes" : "Create Product"}
            </Button>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Products() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["products", { page: page + 1, pageSize, search }],
    queryFn: () => fetchProducts({ page: page + 1, pageSize, search }),
    placeholderData: keepPreviousData,
  });

  const categoriesQ = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });
  const categories = categoriesQ.data?.items ?? [];

  const deleteMut = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });

  const columns = useMemo<MRT_ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Product",
        Cell: ({ row }) => (
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {row.original.name}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{ maxWidth: 220, display: "block" }}
            >
              {row.original.description}
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: "categoryId",
        header: "Category",
        Cell: ({ row }) => {
          const cat = categories.find((c) => c.id === row.original.categoryId);
          return <Typography variant="body2">{cat?.slug ?? "-"}</Typography>;
        },
      },
      {
        accessorKey: "price",
        header: "Price",
        Cell: ({ row }) => (
          <Typography variant="body2">
            \u20AC{row.original.price.toFixed(2)}
          </Typography>
        ),
      },
      { accessorKey: "stock", header: "Stock" },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ row }) => <StatusChip status={row.original.status} />,
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
    manualPagination: true,
    rowCount: query.data?.total ?? 0,
    state: {
      pagination: { pageIndex: page, pageSize },
      isLoading: query.isLoading,
      globalFilter: search,
    },
    onPaginationChange: (updater) => {
      const n =
        typeof updater === "function"
          ? updater({ pageIndex: page, pageSize })
          : updater;
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
        New Product
      </Button>
    ),
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5" fontWeight={700}>
        Products
      </Typography>
      <MaterialReactTable table={table} />
      <ProductFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        editing={editing}
      />
    </Box>
  );
}
