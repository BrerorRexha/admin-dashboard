import type { Order, OrderStatus } from "../types/order";
import { apiClient } from "./apiClient";
import type { Paginated } from "./usersService";

export type OrdersQuery = {
  page: number;
  pageSize: number;
  status: OrderStatus | "";
  search: string;
};

export async function fetchOrders(q: OrdersQuery): Promise<Paginated<Order>> {
  const params: Record<string, string | number> = {
    _page: q.page,
    _limit: q.pageSize,
    _sort: "createdAt",
    _order: "desc"
  };

  if (q.search.trim()) params.q = q.search.trim();
  if (q.status) params.status = q.status;

  const res = await apiClient.get<Order[]>("/orders", { params });
  const total = Number(res.headers["x-total-count"] ?? 0);

  return { items: res.data, total };
}