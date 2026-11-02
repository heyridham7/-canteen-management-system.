export type UserRole = "student" | "staff" | "admin";

export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export type PaymentMethod = "wallet" | "cash_at_counter";
export type PaymentStatus = "paid" | "pending_counter_payment";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  department?: string;
  yearOfStudy?: string;
  walletBalance: number;
  status: "active" | "deactivated";
  createdAt?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: "Breakfast" | "Meals" | "Snacks" | "Beverages" | "Specials";
  price: number;
  preparationTime: string;
  rating: number;
  reviewCount: number;
  isVeg: boolean;
  isAvailable: boolean;
  isActive: boolean;
  image: string;
  calories?: string;
  description: string;
  inventoryItemId?: string;
}

export interface InventoryItem {
  id: string;
  itemName: string;
  category: string;
  currentStock: number;
  unit: string;
  minThreshold: number;
  lastRestocked: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  isVeg: boolean;
}

export interface Order {
  id: string;
  tokenNumber: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  department?: string;
  items: OrderItem[];
  subtotal: number;
  subsidyDiscount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  cancelReason?: string;
  orderedAt: string;
  updatedAt: string;
  estimatedMinutes: number;
  counterBay: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  completedOrdersCount: number;
  activeTokensCount: number;
  pendingCount: number;
  acceptedCount: number;
  preparingCount: number;
  readyCount: number;
  cancelledCount: number;
  totalUsers: number;
  studentCount: number;
  staffCount: number;
  menuItemCount: number;
  availableMenuCount: number;
  lowStockItemsCount: number;
  canteenOnline: boolean;
}
