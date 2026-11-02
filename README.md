# CampusBite CMS — Canteen Management System

> **Academic Software Engineering Project**  
> A modern, responsive, full-stack college canteen management platform with role-based access control, smart FIFO token queue management, live order tracking, and centralized kitchen inventory administration.

---

## 🌟 Project Highlights

CampusBite CMS solves the common bottlenecks of campus dining (long queues, misplaced orders, cash-handling delays, and kitchen miscommunication) through three interconnected stakeholder portals:

1. **Student Portal (`/student`)**:
   - Live dynamic menu with real-time dish availability, dietary tags (Veg / Non-Veg), calories, and wait times.
   - Interactive cart with quantity controls, automated 5% campus subsidy discount calculation, and choice of **Campus Student Wallet** or **Cash at Counter**.
   - Instant cryptographic token generation (e.g. `#A-110`) and live status tracking through 6 order states.
   - Order cancellation rule enforcement: Students can cancel only while status is `Pending`, with instant automatic wallet refund!
   - Itemized order history and receipts.

2. **Canteen Staff Kitchen Terminal (`/staff`)**:
   - Real-time live polling (every 3 seconds) for new student orders.
   - Station bay categorization (e.g. Bay 01: Snacks & Grill, Bay 02: Hot Meals & Thalis, Bay 03: Beverages & Coolers).
   - Lifecycle transition buttons: `Accept Order` ➔ `Start Cooking` ➔ `Mark Ready for Counter` ➔ `Dispatched / Completed`.
   - Search by Token Number, Order ID, or Student Roll Number.
   - Filtering by active vs completed orders.

3. **Administration Console (`/admin`)**:
   - Executive analytics: Total revenue calculated strictly from completed orders (cancelled orders are excluded), order volume breakdown, and campus user counts.
   - Master online order kill-switch (pause new student orders during peak rushes or restocks).
   - Menu Management Master: Add new dishes, edit prices, upload image URLs, toggle `In Stock` / `Sold Out`, and deactivate dishes (without deleting historical order data).
   - Inventory & Supply Management: Raw ingredient tracking with safety thresholds, low-stock visual warning triggers, and non-negative restock validation.
   - User Management: Directory of registered students, staff, and admins with roll numbers, departments, wallet balances, and account activation/deactivation.
   - Historical Orders Audit Trail: Full search and filtering by status and date.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **Frontend UI** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) with dedicated CLI build pipeline |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Backend & APIs** | Next.js Route Handlers (`src/app/api/*`) |
| **Database** | File-backed atomic JSON database (`data/canteen_db.json`) with persistent ACID operations |
| **Security** | Node.js `crypto.scryptSync` password hashing with cryptographic salt |
| **Architecture** | Reusable component hierarchy, role-based access control (RBAC), and shared single source of truth |

---

## 📂 Project Structure

```text
SE_lab/
├── data/
│   └── canteen_db.json         # Shared persistent database file (auto-initialized)
├── public/                     # Static assets & icons
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root application layout with AuthProvider & global styles
│   │   ├── globals.css         # Compiled 2,400+ lines Tailwind CSS utilities
│   │   ├── input.css           # Tailwind source stylesheet
│   │   ├── page.tsx            # Public SaaS landing page
│   │   ├── login/page.tsx      # Secure login with role selector & demo quick-fill
│   │   ├── register/page.tsx   # Student registration (with ₹500 welcome credit grant)
│   │   ├── student/page.tsx    # Complete student dining dashboard
│   │   ├── staff/page.tsx      # Staff kitchen dispatch terminal
│   │   ├── admin/page.tsx      # Administrator console & inventory manager
│   │   └── api/                # Backend API route handlers
│   │       ├── auth/
│   │       │   ├── login/route.ts
│   │       │   ├── register/route.ts
│   │       │   └── wallet/route.ts
│   │       ├── menu/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── orders/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── inventory/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── users/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       └── admin/
│   │           └── stats/route.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx           # Public sticky navbar with mobile drawer
│   │   │   ├── Footer.tsx           # Academic project footer
│   │   │   └── DashboardLayout.tsx  # Navy sidebar layout with RBAC route protection
│   │   └── landing/
│   │       ├── HeroSection.tsx
│   │       ├── FoodVisualSection.tsx
│   │       ├── FeaturesSection.tsx
│   │       └── HowItWorksSection.tsx
│   ├── context/
│   │   └── AuthContext.tsx          # Client auth context synchronized with backend
│   ├── lib/
│   │   └── db.ts                    # Database engine, schema types, seed data & crypto
│   └── types/
│       └── index.ts                 # Shared TypeScript models
├── package.json
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js version 18.x or higher (tested up to Node.js v25.x)
- npm version 9.x or higher

### 2. Installation
Clone the repository and install dependencies:
```bash
cd SE_lab
npm install
```

### 3. Run in Development Mode
Start the development server with live CSS compilation:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Build for Production
To test production optimization and static generation:
```bash
npm run build
npm run start
```

---

## 🔑 Pre-Seeded Academic Demo Accounts

For grading and live evaluation, three accounts are pre-seeded with hashed passwords:

| Role | Email | Password | Pre-loaded Balance | Purpose |
|---|---|---|---|---|
| **Student** | `aarav.cs24@campus.edu` | `campus123` | ₹450 (Refillable) | Browse menu, cart, live tokens, order history |
| **Canteen Staff** | `rajesh.canteen@campus.edu` | `campus123` | — | Live kitchen queue, accept, cook, mark ready |
| **Administrator** | `admin.canteen@campus.edu` | `campus123` | — | Revenue stats, menu master, inventory, user control |

> **Pro Tip**: On the **`/login`** page and in the **Dashboard Topbar/Sidebar**, convenient **1-Click Quick Demo Switcher** buttons are provided so evaluators can seamlessly transition between all three user roles without re-typing.

---

## 🔄 End-to-End Workflow Verification

1. **Student places order**:
   - Student logs in and navigates to the Menu.
   - Adds "Classic Paneer Kathi Roll" and "Refreshing Mint Lemonade".
   - Selects "Student Wallet" payment method.
   - Clicks "Confirm & Place Order".
   - System validates prices, debits wallet balance, creates Order `#ORD-2026-XXXX`, and issues Token `#A-110`.
2. **Staff accepts and cooks**:
   - Staff terminal instantly displays incoming Token `#A-110` in blue **Pending** state.
   - Staff clicks **Accept Order** (`accepted`).
   - Staff clicks **Start Cooking** (`preparing`).
   - Student's screen automatically updates progress bar to "Cooking on Grill".
3. **Staff marks ready for pickup**:
   - Staff clicks **Mark Ready at Bay** (`ready`).
   - Student screen pulses green with counter bay directions ("Bay 01 - Snacks & Grill").
4. **Order collection**:
   - Staff clicks **Hand Over / Done** (`completed`).
   - Admin revenue dashboard automatically credits order total to `Total Revenue`.
5. **Order Cancellation & Refund Rule**:
   - If a student places an order and cancels before staff accepts it, status becomes `cancelled` and the debited amount is credited back to the student's campus wallet balance.

---

## 📜 Academic Integrity & License
Built for the Software Engineering Academic Laboratory Project. Released under the MIT License.
