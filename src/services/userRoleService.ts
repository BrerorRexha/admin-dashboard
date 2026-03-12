import type { UserRole, Permission } from "../types";
import { mockRoles } from "../data/mockData";
import { delay, newId } from "./mockService";

let store: UserRole[] = [...mockRoles];

export async function fetchUserRoles(): Promise<UserRole[]> {
  await delay();
  return [...store].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function fetchUserRoleById(id: string): Promise<UserRole | null> {
  await delay();
  return store.find((r) => r.id === id) ?? null;
}

export async function createUserRole(data: {
  name: string;
  permissions: Permission[];
}): Promise<UserRole> {
  await delay();
  const role: UserRole = {
    id: newId("role"),
    name: data.name,
    permissions: data.permissions,
    createdAt: new Date().toISOString(),
  };
  store = [...store, role];
  return role;
}

export async function updateUserRole(
  id: string,
  data: Partial<Pick<UserRole, "name" | "permissions">>
): Promise<UserRole> {
  await delay();
  const idx = store.findIndex((r) => r.id === id);
  if (idx === -1) throw new Error("Role not found");
  const updated = { ...store[idx], ...data };
  store = store.map((r) => (r.id === id ? updated : r));
  return updated;
}

export async function deleteUserRole(id: string): Promise<void> {
  await delay();
  store = store.filter((r) => r.id !== id);
}
