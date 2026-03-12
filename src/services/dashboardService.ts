import { mockRevenueSeries, mockOrders, mockProducts, mockUsers } from "../data/mockData";
import { delay } from "./mockService";

export async function fetchDashboardStats() {
  await delay(150);
  const totalRevenue = mockOrders.reduce((s, o) => s + o.total, 0);
  const totalOrders = mockOrders.length;
  const inStockCount = mockProducts.filter((p) => p.status === "in_stock").length;
  const outOfStockCount = mockProducts.filter((p) => p.status === "out_of_stock").length;
  const processing = mockOrders.filter((o) => o.status === "processing").length;
  const processed  = mockOrders.filter((o) => o.status === "processed").length;
  const delivered  = mockOrders.filter((o) => o.status === "delivered").length;
  const totalUsers = mockUsers.length;

  return {
    totalRevenue,
    totalOrders,
    inStockCount,
    outOfStockCount,
    processing,
    processed,
    delivered,
    totalUsers,
  };
}

export async function fetchRevenueSeries() {
  await delay(100);
  return [...mockRevenueSeries];
}
