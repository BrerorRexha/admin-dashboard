// ─── Categories ──────────────────────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  slug: string; // e.g. "books/drama"
  createdAt: string;
}

// ─── Specifications ───────────────────────────────────────────────────────────
export interface Specification {
  id: string;
  name: string; // e.g. "Color", "Size"
  categoryId: string;
  createdAt: string;
}

// ─── Spec Values ─────────────────────────────────────────────────────────────
export interface SpecValue {
  id: string;
  value: string; // e.g. "Red", "XL"
  specificationId: string;
  createdAt: string;
}

// ─── Products ────────────────────────────────────────────────────────────────
export type ProductStatus = "in_stock" | "out_of_stock";

export interface Product {
  id: string;
  name: string;
  description: string;
  stock: number;
  price: number;
  images: string[]; // max 4
  categoryId: string;
  specValues: string[]; // SpecValue ids
  status: ProductStatus; // derived from stock
  createdAt: string;
}

// ─── Orders ──────────────────────────────────────────────────────────────────
export type OrderStatus = "processing" | "processed" | "delivered";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  currency: string;
  userId: string;
  customerName: string;
  items: OrderItem[];
  createdAt: string;
}

// ─── User Roles ───────────────────────────────────────────────────────────────
export const ALL_PERMISSIONS = [
  "analytics.read",
  "products.read",
  "products.write",
  "products.delete",
  "orders.read",
  "orders.write",
  "categories.read",
  "categories.write",
  "specifications.read",
  "specifications.write",
  "users.read",
  "users.write",
  "roles.read",
  "roles.write",
] as const;

export type Permission = (typeof ALL_PERMISSIONS)[number];

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
  createdAt: string;
}

// ─── Users ────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  avatar?: string;
  createdAt: string;
}

// ─── Auth / Me ────────────────────────────────────────────────────────────────
export interface Me {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  avatar?: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

// ─── Pagination helpers ───────────────────────────────────────────────────────
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
