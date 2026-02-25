export type OrderStatus = "paid" | "processing" | "shipped" | "cancelled";

export type Order = {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  total: number;
  currency: string;
  createdAt: string;
};