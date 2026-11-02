import fs from "fs";
import path from "path";
import crypto from "crypto";

export type UserRole = "student" | "staff" | "admin";
export type OrderStatus = "pending" | "accepted" | "preparing" | "ready" | "completed" | "cancelled";
export type PaymentMethod = "wallet" | "cash_at_counter";
export type PaymentStatus = "paid" | "pending_counter_payment";

export interface DBUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: UserRole;
  studentId?: string;
  department?: string;
  yearOfStudy?: string;
  walletBalance: number;
  status: "active" | "deactivated";
  createdAt: string;
}

export interface DBMenuItem {
  id: string;
  name: string;
  category: "Breakfast" | "Meals" | "Snacks" | "Beverages" | "Specials";
  price: number;
  preparationTime: string;
  rating: number;
  reviewCount: number;
  isVeg: boolean;
  isAvailable: boolean;
  isActive: boolean; // Soft delete / deactivation
  image: string;
  calories?: string;
  description: string;
  inventoryItemId?: string;
}

export interface DBInventoryItem {
  id: string;
  itemName: string;
  category: string;
  currentStock: number;
  unit: string; // e.g. "portions", "kg", "cups", "loaves"
  minThreshold: number;
  lastRestocked: string;
}

export interface DBOrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  isVeg: boolean;
}

export interface DBOrder {
  id: string;
  tokenNumber: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  department?: string;
  items: DBOrderItem[];
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

export interface DBData {
  users: DBUser[];
  menuItems: DBMenuItem[];
  inventory: DBInventoryItem[];
  orders: DBOrder[];
  canteenOnline: boolean;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "canteen_db.json");

// Helper to hash passwords
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, generatedSalt, 64).toString("hex");
  return { hash, salt: generatedSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const computed = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(computed, "hex"));
}

function getInitialData(): DBData {
  const studentAuth = hashPassword("campus123");
  const staffAuth = hashPassword("campus123");
  const adminAuth = hashPassword("campus123");

  const users: DBUser[] = [
    {
      id: "usr_student_01",
      name: "Aarav Sharma",
      email: "aarav.cs24@campus.edu",
      passwordHash: studentAuth.hash,
      salt: studentAuth.salt,
      role: "student",
      studentId: "2024BCS042",
      department: "Computer Science & Engineering",
      yearOfStudy: "3rd Year",
      walletBalance: 450,
      status: "active",
      createdAt: new Date().toISOString(),
    },
    {
      id: "usr_student_02",
      name: "Priya Nair",
      email: "priya.ece23@campus.edu",
      passwordHash: studentAuth.hash,
      salt: studentAuth.salt,
      role: "student",
      studentId: "2023ECE018",
      department: "Electronics & Communication",
      yearOfStudy: "4th Year",
      walletBalance: 320,
      status: "active",
      createdAt: new Date().toISOString(),
    },
    {
      id: "usr_staff_01",
      name: "Chef Rajesh Kumar",
      email: "rajesh.canteen@campus.edu",
      passwordHash: staffAuth.hash,
      salt: staffAuth.salt,
      role: "staff",
      department: "Food Services & Operations",
      walletBalance: 0,
      status: "active",
      createdAt: new Date().toISOString(),
    },
    {
      id: "usr_admin_01",
      name: "Prof. Sunita Rao",
      email: "admin.canteen@campus.edu",
      passwordHash: adminAuth.hash,
      salt: adminAuth.salt,
      role: "admin",
      department: "Campus Facilities Administration",
      walletBalance: 0,
      status: "active",
      createdAt: new Date().toISOString(),
    },
  ];

  const inventory: DBInventoryItem[] = [
    {
      id: "inv_1",
      itemName: "Fresh Malai Paneer",
      category: "Dairy & Perishables",
      currentStock: 24,
      unit: "kg",
      minThreshold: 8,
      lastRestocked: "2026-11-02",
    },
    {
      id: "inv_2",
      itemName: "Basmati Rice Grade-A",
      category: "Grains & Staples",
      currentStock: 65,
      unit: "kg",
      minThreshold: 20,
      lastRestocked: "2026-11-01",
    },
    {
      id: "inv_3",
      itemName: "Whole Wheat Sandwich Bread",
      category: "Bakery",
      currentStock: 18,
      unit: "loaves",
      minThreshold: 5,
      lastRestocked: "2026-11-02",
    },
    {
      id: "inv_4",
      itemName: "Arabica Espresso Roast",
      category: "Beverages",
      currentStock: 12,
      unit: "kg",
      minThreshold: 4,
      lastRestocked: "2026-10-30",
    },
    {
      id: "inv_5",
      itemName: "Dosa Batter (Fresh Fermented)",
      category: "Breakfast Staples",
      currentStock: 35,
      unit: "portions",
      minThreshold: 10,
      lastRestocked: "2026-11-02",
    },
    {
      id: "inv_6",
      itemName: "Cooking Vegetable Oil",
      category: "Oil & Fats",
      currentStock: 6, // Low stock demo!
      unit: "liters",
      minThreshold: 10,
      lastRestocked: "2026-10-28",
    },
  ];

  const menuItems: DBMenuItem[] = [
    {
      id: "m_1",
      name: "Classic Paneer Kathi Roll",
      category: "Snacks",
      price: 80,
      preparationTime: "6 mins",
      rating: 4.8,
      reviewCount: 142,
      isVeg: true,
      isAvailable: true,
      isActive: true,
      image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80",
      calories: "320 kcal",
      description: "Char-grilled cottage cheese with spiced peppers, crunchy onions, and mint chutney wrapped in a flaky paratha.",
      inventoryItemId: "inv_1",
    },
    {
      id: "m_2",
      name: "Executive South Indian Thali",
      category: "Meals",
      price: 110,
      preparationTime: "8 mins",
      rating: 4.9,
      reviewCount: 230,
      isVeg: true,
      isAvailable: true,
      isActive: true,
      image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80",
      calories: "540 kcal",
      description: "Basmati rice, slow-simmered sambar, rasam, 2 vegetable curries, curd, appalam, and semolina dessert.",
      inventoryItemId: "inv_2",
    },
    {
      id: "m_3",
      name: "Crispy Masala Dosa Combo",
      category: "Breakfast",
      price: 65,
      preparationTime: "5 mins",
      rating: 4.7,
      reviewCount: 198,
      isVeg: true,
      isAvailable: true,
      isActive: true,
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
      calories: "380 kcal",
      description: "Golden crispy crepe infused with potato masala, served with coconut chutney, tomato dip, and hot sambar.",
      inventoryItemId: "inv_5",
    },
    {
      id: "m_4",
      name: "Grilled Veggie Club Sandwich",
      category: "Snacks",
      price: 75,
      preparationTime: "5 mins",
      rating: 4.6,
      reviewCount: 88,
      isVeg: true,
      isAvailable: true,
      isActive: true,
      image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80",
      calories: "290 kcal",
      description: "Triple-layer toasted sandwich stacked with cucumber, tomatoes, cheese slice, and house herb pesto.",
      inventoryItemId: "inv_3",
    },
    {
      id: "m_5",
      name: "Chilled Hazelnut Cold Coffee",
      category: "Beverages",
      price: 50,
      preparationTime: "3 mins",
      rating: 4.9,
      reviewCount: 310,
      isVeg: true,
      isAvailable: true,
      isActive: true,
      image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80",
      calories: "190 kcal",
      description: "Freshly brewed espresso shaken with creamy chilled milk, cocoa syrup, and roasted hazelnut infusion.",
      inventoryItemId: "inv_4",
    },
    {
      id: "m_6",
      name: "Spicy Schezwan Fried Rice Bowl",
      category: "Meals",
      price: 95,
      preparationTime: "7 mins",
      rating: 4.7,
      reviewCount: 165,
      isVeg: true,
      isAvailable: true,
      isActive: true,
      image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80",
      calories: "460 kcal",
      description: "Wok-tossed long-grain rice with crispy garden vegetables, bell peppers, scallions, and signature chili garlic sauce.",
      inventoryItemId: "inv_2",
    },
    {
      id: "m_7",
      name: "Steamed Idli Sambar Platter",
      category: "Breakfast",
      price: 55,
      preparationTime: "4 mins",
      rating: 4.8,
      reviewCount: 114,
      isVeg: true,
      isAvailable: true,
      isActive: true,
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
      calories: "240 kcal",
      description: "Three soft, fluffy steamed rice cakes served with aromatic vegetable sambar and fresh coconut dip.",
      inventoryItemId: "inv_5",
    },
    {
      id: "m_8",
      name: "Refreshing Fresh Mint Lemonade",
      category: "Beverages",
      price: 35,
      preparationTime: "2 mins",
      rating: 4.5,
      reviewCount: 76,
      isVeg: true,
      isAvailable: true,
      isActive: true,
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
      calories: "90 kcal",
      description: "Zesty lemon extract infused with fresh garden mint leaves, black salt, and sparkling soda.",
    },
  ];

  const now = new Date();
  const minsAgo = (m: number) => new Date(now.getTime() - m * 60000).toISOString();

  const orders: DBOrder[] = [
    {
      id: "ORD-2026-1001",
      tokenNumber: "A-108",
      studentId: "2024BCS042",
      studentName: "Aarav Sharma",
      studentEmail: "aarav.cs24@campus.edu",
      department: "Computer Science & Engineering",
      items: [
        { menuItemId: "m_1", name: "Classic Paneer Kathi Roll", price: 80, quantity: 2, isVeg: true },
        { menuItemId: "m_5", name: "Chilled Hazelnut Cold Coffee", price: 50, quantity: 1, isVeg: true },
      ],
      subtotal: 210,
      subsidyDiscount: 11,
      totalAmount: 199,
      paymentMethod: "wallet",
      paymentStatus: "paid",
      status: "ready",
      orderedAt: minsAgo(12),
      updatedAt: minsAgo(2),
      estimatedMinutes: 6,
      counterBay: "Bay 01 (Snacks & Grill)",
    },
    {
      id: "ORD-2026-1002",
      tokenNumber: "A-109",
      studentId: "2023ECE018",
      studentName: "Priya Nair",
      studentEmail: "priya.ece23@campus.edu",
      department: "Electronics & Communication",
      items: [
        { menuItemId: "m_2", name: "Executive South Indian Thali", price: 110, quantity: 1, isVeg: true },
      ],
      subtotal: 110,
      subsidyDiscount: 6,
      totalAmount: 104,
      paymentMethod: "cash_at_counter",
      paymentStatus: "pending_counter_payment",
      status: "preparing",
      orderedAt: minsAgo(8),
      updatedAt: minsAgo(3),
      estimatedMinutes: 8,
      counterBay: "Bay 02 (Meals & Thalis)",
    },
    {
      id: "ORD-2026-1000",
      tokenNumber: "A-107",
      studentId: "2024BCS042",
      studentName: "Aarav Sharma",
      studentEmail: "aarav.cs24@campus.edu",
      department: "Computer Science & Engineering",
      items: [
        { menuItemId: "m_3", name: "Crispy Masala Dosa Combo", price: 65, quantity: 1, isVeg: true },
      ],
      subtotal: 65,
      subsidyDiscount: 3,
      totalAmount: 62,
      paymentMethod: "wallet",
      paymentStatus: "paid",
      status: "completed",
      orderedAt: minsAgo(55),
      updatedAt: minsAgo(25),
      estimatedMinutes: 5,
      counterBay: "Bay 02 (Meals & Thalis)",
    },
  ];

  return {
    users,
    menuItems,
    inventory,
    orders,
    canteenOnline: true,
  };
}

export function readDB(): DBData {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initial = getInitialData();
    writeDB(initial);
    return initial;
  }

  try {
    const content = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(content) as DBData;
  } catch (err) {
    console.error("Failed to read DB, reinitializing:", err);
    const initial = getInitialData();
    writeDB(initial);
    return initial;
  }
}

export function writeDB(data: DBData): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const tmpFile = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tmpFile, DB_FILE);
}
