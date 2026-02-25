import type { Product } from "../types/product";
import { apiClient } from "./apiClient";

export type ProductsQuery = {
  page: number;
  pageSize: number;
  name: string;
  category: string;
};

export type Paginated<T> = {
  items: T[];
  total: number;
};

type JsonServerPage<T> = {
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
  data: T[];
};

export async function fetchProducts(q: ProductsQuery): Promise<Paginated<Product>> {
  const params: Record<string, string | number> = {
    _page: q.page,
    _per_page: q.pageSize,
  };

  if (q.name.trim()) params.q = q.name.trim();
  if (q.category) params.category = q.category;

  const res = await apiClient.get<JsonServerPage<Product>>("/products", { params });
  const total = Number(res.headers["x-total-count"] ?? 0);

  return { items: res.data.data, total };
}

export async function createProduct(payload: Omit<Product, "id" | "createdAt">): Promise<Product> {
  const res = await apiClient.post<Product>("/products", {
    ...payload,
    createdAt: new Date().toISOString()
  });
  return res.data;
}

export async function updateProduct(id: string, payload: Partial<Product>): Promise<Product> {
  const res = await apiClient.patch<Product>(`/products/${id}`, payload);
  return res.data;
}