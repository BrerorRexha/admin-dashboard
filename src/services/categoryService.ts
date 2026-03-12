import type { Category } from "../types";
import { mockCategories } from "../data/mockData";
import { delay, newId, paginate } from "./mockService";

// in-memory store
let store: Category[] = [...mockCategories];

export async function fetchCategories(params?: { page?: number; pageSize?: number; search?: string }) {
  await delay();
  let items = [...store].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  if (params?.search) {
    const q = params.search.toLowerCase();
    items = items.filter((c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q));
  }
  return paginate(items, params?.page ?? 1, params?.pageSize ?? 50);
}

export async function fetchCategoryById(id: string): Promise<Category | null> {
  await delay();
  return store.find((c) => c.id === id) ?? null;
}

export async function createCategory(data: {
  name: string;
  parentId: string | null;
}): Promise<Category> {
  await delay();
  const parent = data.parentId ? store.find((c) => c.id === data.parentId) : null;
  const slug = parent
    ? `${parent.slug}/${data.name.toLowerCase().replace(/\s+/g, "-")}`
    : data.name.toLowerCase().replace(/\s+/g, "-");
  const cat: Category = {
    id: newId("cat"),
    name: data.name,
    parentId: data.parentId,
    slug,
    createdAt: new Date().toISOString(),
  };
  store = [...store, cat];
  return cat;
}

export async function updateCategory(
  id: string,
  data: Partial<Pick<Category, "name" | "parentId">>
): Promise<Category> {
  await delay();
  const idx = store.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Category not found");
  const parent = data.parentId ? store.find((c) => c.id === data.parentId) : null;
  const name = data.name ?? store[idx].name;
  const slug = parent
    ? `${parent.slug}/${name.toLowerCase().replace(/\s+/g, "-")}`
    : name.toLowerCase().replace(/\s+/g, "-");
  const updated = { ...store[idx], ...data, name, slug };
  store = store.map((c) => (c.id === id ? updated : c));
  return updated;
}

export async function deleteCategory(id: string): Promise<void> {
  await delay();
  store = store.filter((c) => c.id !== id);
}
