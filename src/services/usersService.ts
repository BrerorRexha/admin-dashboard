import type { User } from "../types";
import { mockUsers } from "../data/mockData";
import { delay, newId, paginate } from "./mockService";

let store: User[] = [...mockUsers];

export async function fetchUsers(params?: {
  page?: number;
  pageSize?: number;
  roleId?: string;
  search?: string;
}) {
  await delay();
  let items = [...store].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  if (params?.roleId) items = items.filter((u) => u.roleId === params.roleId);
  if (params?.search) {
    const q = params.search.toLowerCase();
    items = items.filter(
      (u) =>
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }
  return paginate(items, params?.page ?? 1, params?.pageSize ?? 10);
}

export async function fetchUserById(id: string): Promise<User | null> {
  await delay();
  return store.find((u) => u.id === id) ?? null;
}

export async function createUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  avatar?: string;
}): Promise<User> {
  await delay();
  const user: User = {
    id: newId("u"),
    ...data,
    createdAt: new Date().toISOString(),
  };
  store = [...store, user];
  return user;
}

export async function updateUser(
  id: string,
  data: Partial<Omit<User, "id" | "createdAt">>
): Promise<User> {
  await delay();
  const idx = store.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error("User not found");
  const updated = { ...store[idx], ...data };
  store = store.map((u) => (u.id === id ? updated : u));
  return updated;
}

export async function deleteUser(id: string): Promise<void> {
  await delay();
  store = store.filter((u) => u.id !== id);
}
