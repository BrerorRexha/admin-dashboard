export type RevenueDailyPoint = {
  date: string;
  revenue: number;
  orders: number;
};

export type ActivityEvent = {
  id: string;
  type: string;
  actorUserId: string;
  createdAt: string;
  meta: Record<string, unknown>;
};