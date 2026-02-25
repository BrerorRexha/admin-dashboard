import type { Me } from "../types/user";
import { apiClient } from "./apiClient";

export async function fetchMe(): Promise<Me> {
  const res = await apiClient.get<Me>("/me");
  return res.data;
}