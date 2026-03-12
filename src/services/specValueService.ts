import type { SpecValue } from "../types";
import { mockSpecValues } from "../data/mockData";
import { delay, newId, paginate } from "./mockService";

let store: SpecValue[] = [...mockSpecValues];

export async function fetchSpecValues(params?: {
  page?: number;
  pageSize?: number;
  specificationId?: string;
  search?: string;
}) {
  await delay();
  let items = [...store].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  if (params?.specificationId)
    items = items.filter((v) => v.specificationId === params.specificationId);
  if (params?.search) {
    const q = params.search.toLowerCase();
    items = items.filter((v) => v.value.toLowerCase().includes(q));
  }
  return paginate(items, params?.page ?? 1, params?.pageSize ?? 100);
}

export async function createSpecValue(data: {
  value: string;
  specificationId: string;
}): Promise<SpecValue> {
  await delay();
  const sv: SpecValue = {
    id: newId("sv"),
    value: data.value,
    specificationId: data.specificationId,
    createdAt: new Date().toISOString(),
  };
  store = [...store, sv];
  return sv;
}

export async function updateSpecValue(
  id: string,
  data: Partial<Pick<SpecValue, "value" | "specificationId">>
): Promise<SpecValue> {
  await delay();
  const idx = store.findIndex((v) => v.id === id);
  if (idx === -1) throw new Error("Spec value not found");
  const updated = { ...store[idx], ...data };
  store = store.map((v) => (v.id === id ? updated : v));
  return updated;
}

export async function deleteSpecValue(id: string): Promise<void> {
  await delay();
  store = store.filter((v) => v.id !== id);
}
