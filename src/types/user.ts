export type UserRole = "admin" | "support" | "viewer";

export type UserStatus = "active" | "disabled";

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
};

export type Me = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
};