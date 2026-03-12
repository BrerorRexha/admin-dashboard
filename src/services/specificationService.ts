import type { Specification } from "../types";
import { mockSpecifications } from "../data/mockData";
import { delay, newId, paginate } from "./mockService";

let store: Specification[] = [...mockSpecifications];

export async function fetchSpecifications(params?: {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  search?: string;
}) {
  await delay();
  let items = [...store].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  if (params?.categoryId) items = items.filter((s) => s.categoryId === params.categoryId);
  if (params?.search) {
    const q = params.search.toLowerCase();
    items = items.filter((s) => s.name.toLowerCase().includes(q));
  }
  return paginate(items, params?.page ?? 1, params?.pageSize ?? 50);
}

export async function createSpecification(data: {
  name: string;
  categoryId: string;
}): Promise<Specification> {
  await delay();
  const spec: Specification = {
    id: newId("spec"),
    name: data.name,
    categoryId: data.categoryId,
    createdAt: new Date().toISOString(),
  };
  store = [...store, spec];
  return spec;
}

export async function updateSpecification(
  id: string,
  data: Partial<Pick<Specification, "name" | "categoryId">>
): Promise<Specification> {
  await delay();
  const idx = store.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error("Specification not found");
  const updated = { ...store[idx], ...data };
  store = store.map((s) => (s.id === id ? updated : s));
  return updated;
}

export async function deleteSpecification(id: string): Promise<void> {
  await delay();
  store = store.filter((s) => s.id !== id);
}
