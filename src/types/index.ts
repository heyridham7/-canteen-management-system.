export type UserRole = "student" | "staff" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  department?: string;
  avatar?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: "Breakfast" | "Meals" | "Snacks" | "Beverages" | "Specials";
  price: number;
  preparationTime: string;
  rating: number;
  isVeg: boolean;
  isAvailable: boolean;
  image: string;
  calories?: string;
}

export interface OrderToken {
  id: string;
  tokenNumber: string;
  studentName: string;
  studentId: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  status: "pending" | "preparing" | "ready" | "completed";
  orderedAt: string;
  estimatedMinutes: number;
}
