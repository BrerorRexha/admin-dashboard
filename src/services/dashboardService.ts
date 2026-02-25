import type { ActivityEvent, RevenueDailyPoint } from "../types/dashboard";
import { apiClient } from "./apiClient";

export async function fetchRevenueDaily(): Promise<RevenueDailyPoint[]> {
  const res = await apiClient.get<RevenueDailyPoint[]>("/revenueDaily");
  return res.data;
}

export async function fetchRecentActivity(): Promise<ActivityEvent[]> {
  const res = await apiClient.get<ActivityEvent[]>("/activityEvents", {
    params: { _sort: "createdAt", _order: "desc", _limit: 10 }
  });
  return res.data;
}