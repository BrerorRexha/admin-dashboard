import type { Me } from "../types";
import { mockMe } from "../data/mockData";
import { delay } from "./mockService";

let me: Me = { ...mockMe };

export async function fetchMe(): Promise<Me> {
  await delay(100);
  return { ...me };
}

export async function updateMe(data: Partial<Me>): Promise<Me> {
  await delay();
  me = { ...me, ...data };
  return { ...me };
}
