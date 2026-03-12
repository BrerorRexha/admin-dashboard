/**
 * Simulates network latency for mock services.
 */
export const delay = (ms = 200) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Paginate an array.
 */
export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number
): { items: T[]; total: number; page: number; pageSize: number } {
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize,
  };
}

/**
 * Generate a simple random id.
 */
export const newId = (prefix: string) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
