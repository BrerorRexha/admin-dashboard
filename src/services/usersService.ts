import type { User } from "../types/user";
import { apiClient } from "./apiClient";

export type UsersQuery = {
  page: number;
  pageSize: number;
  search: string;
  role: string;
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

export async function fetchUsers(q: UsersQuery): Promise<Paginated<User>> {
  const params: Record<string, string | number> = {
    _page: q.page,
    _per_page: q.pageSize,
  };

  if (q.search.trim()) params.q = q.search.trim();
  if (q.role) params.role = q.role;

  const res = await apiClient.get<JsonServerPage<User>>("/users", { params });
  const total = Number(res.headers["x-total-count"] ?? 0);

  return { items: res.data.data, total };
}

export async function createUser(payload: Omit<User, "id" | "createdAt">): Promise<User> {
  const res = await apiClient.post<User>("/users", {
    ...payload,
    createdAt: new Date().toISOString()
  });
  return res.data;
}

export async function updateUser(id: string, payload: Partial<User>): Promise<User> {
  const res = await apiClient.patch<User>(`/users/${id}`, payload);
  return res.data;
}