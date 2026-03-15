import type { Order, OrderStatus } from "../types";
import { mockOrders } from "../data/mockData";
import { delay, paginate } from "./mockService";

let store: Order[] = [...mockOrders];

export async function fetchOrders(params?: {
  page?: number;
  pageSize?: number;
  status?: OrderStatus | "";
  search?: string;
}) {
  await delay();
  let items = [...store].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  if (params?.status) items = items.filter((o) => o.status === params.status);
  if (params?.search) {
    const q = params.search.toLowerCase();
    items = items.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q)
    );
  }
  return paginate(items, params?.page ?? 1, params?.pageSize ?? 10);
}

export async function fetchOrderById(id: string): Promise<Order | null> {
  await delay();
  return store.find((o) => o.id === id) ?? null;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  await delay();
  const idx = store.findIndex((o) => o.id === id);
  if (idx === -1) throw new Error("Order not found");
  const updated = { ...store[idx], status };
  store = store.map((o) => (o.id === id ? updated : o));
  return updated;
}

export async function deleteOrder(id: string): Promise<void> {
  await delay();
  store = store.filter((o) => o.id !== id);
}
