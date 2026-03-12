import type { Product, ProductStatus } from "../types";
import { mockProducts } from "../data/mockData";
import { delay, newId, paginate } from "./mockService";

let store: Product[] = [...mockProducts];

const toStatus = (stock: number): ProductStatus => (stock > 0 ? "in_stock" : "out_of_stock");

export async function fetchProducts(params?: {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  status?: ProductStatus | "";
  search?: string;
}) {
  await delay();
  let items = [...store].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  if (params?.categoryId) items = items.filter((p) => p.categoryId === params.categoryId);
  if (params?.status) items = items.filter((p) => p.status === params.status);
  if (params?.search) {
    const q = params.search.toLowerCase();
    items = items.filter((p) => p.name.toLowerCase().includes(q));
  }
  return paginate(items, params?.page ?? 1, params?.pageSize ?? 10);
}

export async function fetchProductById(id: string): Promise<Product | null> {
  await delay();
  return store.find((p) => p.id === id) ?? null;
}

export async function createProduct(data: {
  name: string;
  description: string;
  stock: number;
  price: number;
  images: string[];
  categoryId: string;
  specValues: string[];
}): Promise<Product> {
  await delay();
  const product: Product = {
    id: newId("prod"),
    ...data,
    status: toStatus(data.stock),
    createdAt: new Date().toISOString(),
  };
  store = [...store, product];
  return product;
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<Product, "id" | "createdAt" | "status">>
): Promise<Product> {
  await delay();
  const idx = store.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Product not found");
  const updated: Product = {
    ...store[idx],
    ...data,
    status: data.stock !== undefined ? toStatus(data.stock) : store[idx].status,
  };
  store = store.map((p) => (p.id === id ? updated : p));
  return updated;
}

export async function deleteProduct(id: string): Promise<void> {
  await delay();
  store = store.filter((p) => p.id !== id);
}
