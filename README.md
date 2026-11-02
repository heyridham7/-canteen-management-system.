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
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Static Export) |
| **Frontend UI** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) with dedicated CLI build pipeline |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Client Demo Engine** | Browser `localStorage` storage layer (`src/lib/demoStorage.ts`) with cross-tab live event bus |
| **Full-Stack Architecture** | Preserved Next.js Route Handlers (`backend/api/*`) & atomic file database (`src/lib/db.ts`) |
| **CI/CD Deployment** | GitHub Actions (`.github/workflows/deploy.yml`) to GitHub Pages |
| **Architecture** | Reusable component hierarchy, role-based access control (RBAC), and shared state synchronization |

---

## 🌐 GitHub Pages Deployment & Demonstration Mode

This project is prepared for zero-configuration, serverless demonstration via **GitHub Pages**, following the academic showcase pattern:

### 1. Static Export Configuration
- Next.js is configured for static site export (`output: "export"`) in [`next.config.ts`](file:///Users/ridhamp/Desktop/SE_lab/next.config.ts).
- Configured repository base path and asset prefix: `/-canteen-management-system`.
- In production / CI builds (`GITHUB_PAGES=true`), Next.js automatically prefixes all scripts, stylesheets, and navigation links.

### 2. Client-Side Browser Storage (`localStorage`)
- Because static hosting on GitHub Pages does not run a server runtime or backend Node.js APIs, the interactive demonstration is powered by [`src/lib/demoStorage.ts`](file:///Users/ridhamp/Desktop/SE_lab/src/lib/demoStorage.ts).
- Supports demo registration/login, menu browsing, cart checkout, token generation, live kitchen order lifecycle transitions, inventory updates, and admin menu management directly in the browser.
- Uses `window.dispatchEvent` with custom events (`campusbite_demo_sync`) and storage listeners to ensure live synchronization across multiple tabs simultaneously (e.g. Student tab in one window, Kitchen Staff in another).

### 3. Preserved Full-Stack Backend Architecture
- The complete Node.js/Next.js Route Handlers and file-backed database engine are preserved in [`backend/api/`](file:///Users/ridhamp/Desktop/SE_lab/backend/api/) and [`src/lib/db.ts`](file:///Users/ridhamp/Desktop/SE_lab/src/lib/db.ts) for full-stack Node.js server deployment or local evaluation.
- Note for evaluation: On GitHub Pages, data persists in the evaluator's browser `localStorage`; no external database or backend server is running in GitHub Pages static hosting.

### 4. GitHub Repository Settings for Deployment
To enable deployment on GitHub:
1. Navigate to your repository on GitHub.
2. Go to **Settings** ➔ **Pages**.
3. Under **Build and deployment** ➔ **Source**, select **GitHub Actions**.
4. Pushing to `main` will automatically trigger the workflow in [`.github/workflows/deploy.yml`](file:///Users/ridhamp/Desktop/SE_lab/.github/workflows/deploy.yml), building the static export with Node.js 22 and deploying to `https://<username>.github.io/-canteen-management-system/`.

---

## 📂 Project Structure

```text
SE_lab/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow for automated Pages deployment
├── backend/
│   └── api/                    # Preserved full-stack Route Handlers (for Node.js server deployment)
│       ├── auth/
│       ├── menu/
│       ├── orders/
│       ├── inventory/
│       ├── users/
│       └── admin/
├── data/
│   └── canteen_db.json         # Shared persistent database file (full-stack mode)
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
│   │   └── admin/page.tsx      # Administrator console & inventory manager
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
│   │   └── AuthContext.tsx          # Client auth context synchronized with storage
│   ├── lib/
│   │   ├── demoStorage.ts           # Browser localStorage demo database engine (GitHub Pages)
│   │   └── db.ts                    # Backend database engine & crypto (full-stack mode)
│   └── types/
│       └── index.ts                 # Shared TypeScript models
├── next.config.ts              # Static export & repository basePath configuration
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
