import type { Order, OrderStatus } from "../types/order";
import { apiClient } from "./apiClient";
import type { Paginated } from "./usersService";

export type OrdersQuery = {
  page: number;
  pageSize: number;
  status: OrderStatus | "";
  search: string;
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

export async function fetchOrders(q: OrdersQuery): Promise<Paginated<Order>> {
  const params: Record<string, string | number> = {
    _page: q.page,
    _per_page: q.pageSize,
  };

  const search = q.search?.trim();
  if (search) params.q = search;
  if (q.status) params.status = q.status;

  const res = await apiClient.get<JsonServerPage<Order>>("/orders", { params });

  return { items: res.data.data, total: res.data.items };
}