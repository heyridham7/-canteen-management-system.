import { User, MenuItem, InventoryItem, Order, DashboardStats, OrderStatus, UserRole } from "@/types";

const DEMO_DB_KEY = "campusbite_cms_demo_db_v1";

interface DemoDBData {
  users: (User & { password?: string })[];
  menuItems: MenuItem[];
  inventory: InventoryItem[];
  orders: Order[];
  canteenOnline: boolean;
}

function getInitialDemoData(): DemoDBData {
  const users: (User & { password?: string })[] = [
    {
      id: "usr_student_01",
      name: "Aarav Sharma",
      email: "aarav.cs24@campus.edu",
      password: "campus123",
      role: "student",
      studentId: "2024BCS042",
      department: "Computer Science & Engineering",
      yearOfStudy: "3rd Year",
      walletBalance: 450,
      status: "active",
      createdAt: "2026-11-01T10:00:00.000Z",
    },
    {
      id: "usr_student_02",
      name: "Priya Nair",
      email: "priya.ece23@campus.edu",
      password: "campus123",
      role: "student",
      studentId: "2023ECE018",
      department: "Electronics & Communication",
      yearOfStudy: "4th Year",
      walletBalance: 320,
      status: "active",
      createdAt: "2026-11-01T11:00:00.000Z",
    },
    {
      id: "usr_staff_01",
      name: "Chef Rajesh Kumar",
      email: "rajesh.canteen@campus.edu",
      password: "campus123",
      role: "staff",
      department: "Food Services & Operations",
      walletBalance: 0,
      status: "active",
      createdAt: "2026-10-15T08:00:00.000Z",
    },
    {
      id: "usr_admin_01",
      name: "Prof. Sunita Rao",
      email: "admin.canteen@campus.edu",
      password: "campus123",
      role: "admin",
      department: "Campus Facilities Administration",
      walletBalance: 0,
      status: "active",
      createdAt: "2026-10-01T08:00:00.000Z",
    },
  ];

  const inventory: InventoryItem[] = [
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

  const menuItems: MenuItem[] = [
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

  const orders: Order[] = [
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

// Load DB from localStorage safely
function loadDemoDB(): DemoDBData {
  if (typeof window === "undefined") {
    return getInitialDemoData();
  }

  try {
    const raw = localStorage.getItem(DEMO_DB_KEY);
    if (!raw) {
      const initial = getInitialDemoData();
      localStorage.setItem(DEMO_DB_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw) as DemoDBData;
  } catch (e) {
    console.error("Failed to load demo DB, resetting to defaults", e);
    const initial = getInitialDemoData();
    localStorage.setItem(DEMO_DB_KEY, JSON.stringify(initial));
    return initial;
  }
}

// Save DB to localStorage safely
function saveDemoDB(data: DemoDBData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DEMO_DB_KEY, JSON.stringify(data));
    // Dispatch custom event so all open views / components update immediately
    window.dispatchEvent(new Event("campusbite_demo_sync"));
  } catch (e) {
    console.error("Failed to save demo DB to localStorage", e);
  }
}

// -------------------------------------------------------------
// EXPORTED DEMO CLIENT API
// -------------------------------------------------------------

export function demoResetData(): void {
  const initial = getInitialDemoData();
  saveDemoDB(initial);
}

export function demoLogin(email: string, password: string, role?: UserRole): {
  success: boolean;
  message: string;
  user?: User;
} {
  const db = loadDemoDB();
  const user = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!user) {
    return { success: false, message: "Account not found with this email." };
  }

  if (user.status === "deactivated") {
    return { success: false, message: "This account has been deactivated by administration." };
  }

  if (role && user.role !== role) {
    return {
      success: false,
      message: `Account is registered as '${user.role.toUpperCase()}', not '${role.toUpperCase()}'.`,
    };
  }

  if (user.password && user.password !== password && password !== "campus123") {
    return { success: false, message: "Invalid password. (Demo password: campus123)" };
  }

  const { password: _, ...safeUser } = user;
  return { success: true, message: "Login successful.", user: safeUser };
}

export function demoRegister(userData: {
  name: string;
  email: string;
  password: string;
  studentId: string;
  department?: string;
  yearOfStudy?: string;
}): { success: boolean; message: string; user?: User } {
  const db = loadDemoDB();

  if (db.users.some((u) => u.email.toLowerCase() === userData.email.trim().toLowerCase())) {
    return { success: false, message: "An account with this email already exists." };
  }

  if (db.users.some((u) => u.studentId && u.studentId.toLowerCase() === userData.studentId.trim().toLowerCase())) {
    return { success: false, message: "This student ID / Roll number is already registered." };
  }

  const newUser: User & { password?: string } = {
    id: "usr_" + Math.random().toString(36).substring(2, 9),
    name: userData.name.trim(),
    email: userData.email.trim().toLowerCase(),
    password: userData.password,
    role: "student",
    studentId: userData.studentId.trim().toUpperCase(),
    department: userData.department || "Engineering",
    yearOfStudy: userData.yearOfStudy || "1st Year",
    walletBalance: 500, // Welcome grant
    status: "active",
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  saveDemoDB(db);

  const { password: _, ...safeUser } = newUser;
  return {
    success: true,
    message: "Student account created successfully with ₹500 welcome credit.",
    user: safeUser,
  };
}

export function demoTopUpWallet(userId: string, amount: number): {
  success: boolean;
  message: string;
  newBalance?: number;
} {
  const db = loadDemoDB();
  const idx = db.users.findIndex((u) => u.id === userId);
  if (idx === -1) {
    return { success: false, message: "User account not found." };
  }

  db.users[idx].walletBalance += amount;
  saveDemoDB(db);

  return {
    success: true,
    message: `Added ₹${amount} to wallet.`,
    newBalance: db.users[idx].walletBalance,
  };
}

export function demoGetMenu(category?: string, search?: string, includeInactive = false): {
  items: MenuItem[];
  canteenOnline: boolean;
} {
  const db = loadDemoDB();
  let items = db.menuItems;

  if (!includeInactive) {
    items = items.filter((m) => m.isActive);
  }

  if (category && category !== "all") {
    items = items.filter((m) => m.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    items = items.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
    );
  }

  return { items, canteenOnline: db.canteenOnline };
}

export function demoAddMenuItem(dishData: Partial<MenuItem>): MenuItem {
  const db = loadDemoDB();
  const newItem: MenuItem = {
    id: "m_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
    name: dishData.name?.trim() || "New Dish",
    category: dishData.category || "Snacks",
    price: Number(dishData.price) || 50,
    preparationTime: dishData.preparationTime || "5 mins",
    rating: 5.0,
    reviewCount: 1,
    isVeg: dishData.isVeg !== undefined ? Boolean(dishData.isVeg) : true,
    isAvailable: true,
    isActive: true,
    image: dishData.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    calories: dishData.calories || "300 kcal",
    description: dishData.description || "Freshly cooked chef special meal prepared on demand.",
  };

  db.menuItems.unshift(newItem);
  saveDemoDB(db);
  return newItem;
}

export function demoUpdateMenuItem(id: string, updates: Partial<MenuItem>): MenuItem | null {
  const db = loadDemoDB();
  const idx = db.menuItems.findIndex((m) => m.id === id);
  if (idx === -1) return null;

  db.menuItems[idx] = { ...db.menuItems[idx], ...updates, id };
  saveDemoDB(db);
  return db.menuItems[idx];
}

export function demoToggleMenuAvailability(id: string, isAvailable: boolean): boolean {
  const db = loadDemoDB();
  const idx = db.menuItems.findIndex((m) => m.id === id);
  if (idx === -1) return false;

  db.menuItems[idx].isAvailable = isAvailable;
  saveDemoDB(db);
  return true;
}

export function demoDeactivateMenuItem(id: string): boolean {
  const db = loadDemoDB();
  const idx = db.menuItems.findIndex((m) => m.id === id);
  if (idx === -1) return false;

  db.menuItems[idx].isActive = false;
  saveDemoDB(db);
  return true;
}

export function demoGetOrders(studentId?: string, status?: string, search?: string): Order[] {
  const db = loadDemoDB();
  let orders = [...db.orders];

  if (studentId) {
    orders = orders.filter((o) => o.studentId === studentId);
  }

  if (status && status !== "all") {
    orders = orders.filter((o) => o.status === status);
  }

  if (search) {
    const q = search.toLowerCase();
    orders = orders.filter(
      (o) =>
        o.tokenNumber.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        o.studentName.toLowerCase().includes(q) ||
        (o.studentId && o.studentId.toLowerCase().includes(q))
    );
  }

  orders.sort((a, b) => new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime());
  return orders;
}

export function demoCreateOrder(orderData: {
  studentId: string;
  studentName: string;
  studentEmail: string;
  department?: string;
  items: { menuItemId: string; quantity: number }[];
  paymentMethod: "wallet" | "cash_at_counter";
}): { success: boolean; message: string; order?: Order } {
  const db = loadDemoDB();

  if (!db.canteenOnline) {
    return {
      success: false,
      message: "Online ordering is temporarily paused by canteen management.",
    };
  }

  if (!orderData.items || orderData.items.length === 0) {
    return { success: false, message: "Order cart is empty." };
  }

  const validatedItems: Order["items"] = [];
  let calculatedSubtotal = 0;
  let maxPrepMins = 4;
  let hasMeals = false;
  let hasBeveragesOnly = true;

  for (const cartItem of orderData.items) {
    const dbItem = db.menuItems.find((m) => m.id === cartItem.menuItemId && m.isActive);
    if (!dbItem) {
      return { success: false, message: `Item no longer available.` };
    }
    if (!dbItem.isAvailable) {
      return { success: false, message: `'${dbItem.name}' is sold out.` };
    }

    const qty = Math.max(1, Math.min(20, cartItem.quantity));
    calculatedSubtotal += dbItem.price * qty;

    if (dbItem.category === "Meals") hasMeals = true;
    if (dbItem.category !== "Beverages") hasBeveragesOnly = false;

    const match = dbItem.preparationTime.match(/\d+/);
    if (match) {
      const mins = parseInt(match[0], 10);
      if (mins > maxPrepMins) maxPrepMins = mins;
    }

    validatedItems.push({
      menuItemId: dbItem.id,
      name: dbItem.name,
      price: dbItem.price,
      quantity: qty,
      isVeg: dbItem.isVeg,
    });

    if (dbItem.inventoryItemId) {
      const inv = db.inventory.find((i) => i.id === dbItem.inventoryItemId);
      if (inv && inv.currentStock > 0) {
        inv.currentStock = Math.max(0, inv.currentStock - qty);
      }
    }
  }

  const subsidyDiscount = Math.round(calculatedSubtotal * 0.05);
  const totalAmount = calculatedSubtotal - subsidyDiscount;

  const paymentMethod = orderData.paymentMethod === "cash_at_counter" ? "cash_at_counter" : "wallet";
  let paymentStatus: "paid" | "pending_counter_payment" = "pending_counter_payment";

  if (paymentMethod === "wallet") {
    const userIdx = db.users.findIndex(
      (u) =>
        u.studentId === orderData.studentId ||
        u.email.toLowerCase() === orderData.studentEmail.toLowerCase()
    );

    if (userIdx === -1) {
      return { success: false, message: "Student account not found." };
    }

    if (db.users[userIdx].walletBalance < totalAmount) {
      return {
        success: false,
        message: `Insufficient student wallet balance (Available: ₹${db.users[userIdx].walletBalance}, Required: ₹${totalAmount}).`,
      };
    }

    db.users[userIdx].walletBalance -= totalAmount;
    paymentStatus = "paid";
  }

  // Generate Token
  const existingTokens = db.orders.map((o) => {
    const parts = o.tokenNumber.split("-");
    return parts.length === 2 ? parseInt(parts[1], 10) : 100;
  });
  const maxNum = existingTokens.length > 0 ? Math.max(...existingTokens) : 109;
  const nextTokenNum = maxNum >= 999 ? 101 : maxNum + 1;
  const tokenNumber = `A-${nextTokenNum}`;

  const orderId = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  let counterBay = "Bay 01 (Snacks & Grill)";
  if (hasBeveragesOnly) {
    counterBay = "Bay 03 (Beverages & Coolers)";
  } else if (hasMeals) {
    counterBay = "Bay 02 (Meals & Thalis)";
  }

  const now = new Date().toISOString();
  const newOrder: Order = {
    id: orderId,
    tokenNumber,
    studentId: orderData.studentId,
    studentName: orderData.studentName,
    studentEmail: orderData.studentEmail,
    department: orderData.department || "Engineering",
    items: validatedItems,
    subtotal: calculatedSubtotal,
    subsidyDiscount,
    totalAmount,
    paymentMethod,
    paymentStatus,
    status: "pending",
    orderedAt: now,
    updatedAt: now,
    estimatedMinutes: maxPrepMins,
    counterBay,
  };

  db.orders.unshift(newOrder);
  saveDemoDB(db);

  return {
    success: true,
    message: `Order placed successfully! Token #${tokenNumber} assigned.`,
    order: newOrder,
  };
}

export function demoUpdateOrderStatus(
  orderId: string,
  nextStatus: OrderStatus,
  requestedByRole: string,
  studentId?: string,
  cancelReason?: string
): { success: boolean; message: string; order?: Order } {
  const db = loadDemoDB();
  const idx = db.orders.findIndex((o) => o.id === orderId);

  if (idx === -1) {
    return { success: false, message: "Order not found." };
  }

  const currentOrder = db.orders[idx];

  // Cancellation rule
  if (nextStatus === "cancelled") {
    if (requestedByRole === "student") {
      if (studentId && currentOrder.studentId !== studentId) {
        return { success: false, message: "Unauthorized." };
      }
      if (currentOrder.status !== "pending") {
        return {
          success: false,
          message: `Order cannot be cancelled because the kitchen has already marked it as '${currentOrder.status.toUpperCase()}'.`,
        };
      }
    }

    if (currentOrder.status === "cancelled" || currentOrder.status === "completed") {
      return { success: false, message: `Order is already marked as ${currentOrder.status}.` };
    }

    // Refund wallet
    if (currentOrder.paymentMethod === "wallet" && currentOrder.paymentStatus === "paid") {
      const userIdx = db.users.findIndex(
        (u) =>
          u.studentId === currentOrder.studentId ||
          u.email.toLowerCase() === currentOrder.studentEmail.toLowerCase()
      );
      if (userIdx !== -1) {
        db.users[userIdx].walletBalance += currentOrder.totalAmount;
      }
    }

    // Restore inventory
    for (const item of currentOrder.items) {
      const dbItem = db.menuItems.find((m) => m.id === item.menuItemId);
      if (dbItem && dbItem.inventoryItemId) {
        const inv = db.inventory.find((i) => i.id === dbItem.inventoryItemId);
        if (inv) inv.currentStock += item.quantity;
      }
    }

    db.orders[idx].status = "cancelled";
    db.orders[idx].cancelReason = cancelReason || "Cancelled by student";
    db.orders[idx].updatedAt = new Date().toISOString();
    saveDemoDB(db);

    return {
      success: true,
      message: "Order cancelled and wallet refunded.",
      order: db.orders[idx],
    };
  }

  db.orders[idx].status = nextStatus;
  db.orders[idx].updatedAt = new Date().toISOString();

  if (nextStatus === "completed" && db.orders[idx].paymentMethod === "cash_at_counter") {
    db.orders[idx].paymentStatus = "paid";
  }

  saveDemoDB(db);
  return {
    success: true,
    message: `Order #${currentOrder.tokenNumber} marked as ${nextStatus}.`,
    order: db.orders[idx],
  };
}

export function demoGetInventory(): (InventoryItem & { isLowStock: boolean })[] {
  const db = loadDemoDB();
  return db.inventory.map((item) => ({
    ...item,
    isLowStock: item.currentStock <= item.minThreshold,
  }));
}

export function demoAddInventory(itemData: Partial<InventoryItem>): InventoryItem {
  const db = loadDemoDB();
  const newItem: InventoryItem = {
    id: "inv_" + Date.now().toString(36),
    itemName: itemData.itemName?.trim() || "New Supply",
    category: itemData.category || "General Supplies",
    currentStock: Number(itemData.currentStock) || 10,
    unit: itemData.unit?.trim() || "kg",
    minThreshold: Number(itemData.minThreshold) || 5,
    lastRestocked: new Date().toISOString().split("T")[0],
  };

  db.inventory.push(newItem);
  saveDemoDB(db);
  return newItem;
}

export function demoUpdateInventory(
  id: string,
  restockQty?: number,
  stockQty?: number,
  threshold?: number
): InventoryItem | null {
  const db = loadDemoDB();
  const idx = db.inventory.findIndex((i) => i.id === id);
  if (idx === -1) return null;

  if (restockQty !== undefined && restockQty >= 0) {
    db.inventory[idx].currentStock += restockQty;
    db.inventory[idx].lastRestocked = new Date().toISOString().split("T")[0];
  } else if (stockQty !== undefined && stockQty >= 0) {
    db.inventory[idx].currentStock = stockQty;
  }

  if (threshold !== undefined && threshold >= 0) {
    db.inventory[idx].minThreshold = threshold;
  }

  saveDemoDB(db);
  return db.inventory[idx];
}

export function demoGetUsers(): User[] {
  const db = loadDemoDB();
  return db.users.map(({ password: _, ...u }) => u);
}

export function demoToggleUserStatus(id: string, nextStatus: "active" | "deactivated"): boolean {
  const db = loadDemoDB();
  const idx = db.users.findIndex((u) => u.id === id);
  if (idx === -1) return false;

  db.users[idx].status = nextStatus;
  saveDemoDB(db);
  return true;
}

export function demoGetStats(): DashboardStats {
  const db = loadDemoDB();

  // Strictly completed orders count towards revenue!
  const completedOrders = db.orders.filter((o) => o.status === "completed");
  const totalRevenue = completedOrders.reduce((acc, o) => acc + o.totalAmount, 0);

  const pendingCount = db.orders.filter((o) => o.status === "pending").length;
  const acceptedCount = db.orders.filter((o) => o.status === "accepted").length;
  const preparingCount = db.orders.filter((o) => o.status === "preparing").length;
  const readyCount = db.orders.filter((o) => o.status === "ready").length;
  const cancelledCount = db.orders.filter((o) => o.status === "cancelled").length;

  const activeTokensCount = pendingCount + acceptedCount + preparingCount + readyCount;

  const studentCount = db.users.filter((u) => u.role === "student").length;
  const staffCount = db.users.filter((u) => u.role === "staff").length;

  const activeMenuItems = db.menuItems.filter((m) => m.isActive);
  const availableMenuCount = activeMenuItems.filter((m) => m.isAvailable).length;
  const lowStockItemsCount = db.inventory.filter((i) => i.currentStock <= i.minThreshold).length;

  return {
    totalRevenue,
    totalOrders: db.orders.length,
    completedOrdersCount: completedOrders.length,
    activeTokensCount,
    pendingCount,
    acceptedCount,
    preparingCount,
    readyCount,
    cancelledCount,
    totalUsers: db.users.length,
    studentCount,
    staffCount,
    menuItemCount: activeMenuItems.length,
    availableMenuCount,
    lowStockItemsCount,
    canteenOnline: db.canteenOnline,
  };
}

export function demoToggleCanteenOnline(canteenOnline: boolean): boolean {
  const db = loadDemoDB();
  db.canteenOnline = canteenOnline;
  saveDemoDB(db);
  return db.canteenOnline;
}
