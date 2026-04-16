# 🛒 ShopHub — Amazon-Like E-Commerce Platform

A full-stack, production-quality e-commerce web application built to demonstrate strong full-stack engineering fundamentals. The platform replicates Amazon's UI patterns and provides complete product browsing, cart management, and order placement functionality.

![Tech Stack](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Tech Stack](https://img.shields.io/badge/Express.js-4-green?logo=express)
![Tech Stack](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)
![Tech Stack](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?logo=tailwindcss)

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Overview](#project-overview)
- [Data Flow](#data-flow)
- [Folder Structure](#folder-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Features](#features)
- [Architecture Decisions](#architecture-decisions)
- [Interview Talking Points](#interview-talking-points)
- [Deployment](#deployment)

---

## 🛠 Tech Stack

| Layer      | Technology                |
|------------|---------------------------|
| Frontend   | Next.js 16 (App Router)   |
| Styling    | Tailwind CSS 4            |
| HTTP Client| Axios (with interceptors) |
| Backend    | Node.js + Express.js      |
| Database   | PostgreSQL (Supabase)     |
| ORM        | Raw SQL via `pg` driver   |

---

## 📖 Project Overview

This application implements a complete e-commerce flow:

1. **Browse Products** — Grid listing with search (debounced), category filters, and sorting
2. **View Product Details** — Image carousel, ratings, specifications, stock status, related products
3. **Shopping Cart** — Persistent (database-backed), add/update/remove items
4. **Checkout** — Address form with validation + order summary with tax calculation
5. **Order Confirmation** — Displays order ID, items purchased, shipping address, and total

**No authentication required** — a default user (id=1) is assumed logged in.

### Zero-Config Mode

The backend automatically detects if a database is configured. If `DATABASE_URL` is missing or uses placeholder values, the server switches to an **in-memory data store** with 20 pre-loaded products. This means the app works out-of-the-box without any database setup:

```
Start backend → No DB? → In-Memory Mode (20 products, cart & orders in RAM)
Start backend → Valid DB → PostgreSQL Mode (persistent storage)
```

---

## 🔄 Data Flow

This section explains how data moves through the system — from user interaction to database and back.

### Frontend → Backend → Database

```
User clicks "Add to Cart"
        │
        ▼
React Component (ProductCard.jsx)
  └── calls addToCart() from CartContext
        │
        ▼
CartContext (context/CartContext.js)
  └── calls cartAPI.addItem(productId, quantity)
        │
        ▼
Axios Client (lib/api.js)
  └── POST /api/cart/add { product_id, quantity }
        │
        ▼
Express Router (routes/cartRoutes.js)
  └── routes to cartController.addItem
        │
        ▼
Controller (controllers/cartController.js)
  └── extracts body params, calls cartService.addItem()
        │
        ▼
Service Layer (services/cartService.js)
  └── validates input, checks isInMemoryMode()
  └── if in-memory: calls memStore.addToCart()
  └── if PostgreSQL: executes UPSERT query via pg pool
        │
        ▼
Database / In-Memory Store
  └── INSERT ... ON CONFLICT DO UPDATE (atomic upsert)
        │
        ▼
Response flows back: DB → Service → Controller → Axios → Context → UI updates
```

### Why This Architecture?

- **Routes** handle URL mapping only — no business logic
- **Controllers** handle HTTP concerns (req/res parsing) — no DB queries
- **Services** contain business logic and data access — the core of the app
- **Models** store query constants — no logic, just SQL strings

This separation means you can swap PostgreSQL for MongoDB by changing only the service layer. Controllers and routes remain untouched.

---

## 📁 Folder Structure

```
Root/
├── frontend/                      # Next.js App Router
│   ├── src/
│   │   ├── app/                   # Pages (App Router)
│   │   │   ├── layout.js          # Root layout with CartProvider
│   │   │   ├── page.js            # Home — product listing + sorting
│   │   │   ├── product/[id]/
│   │   │   │   └── page.js        # Product detail + related products
│   │   │   ├── cart/
│   │   │   │   └── page.js        # Shopping cart
│   │   │   ├── checkout/
│   │   │   │   └── page.js        # Checkout form
│   │   │   └── order-success/
│   │   │       └── page.js        # Order confirmation
│   │   ├── components/            # Reusable React components
│   │   │   ├── Navbar.jsx         # Search, categories, cart badge
│   │   │   ├── ProductCard.jsx    # Grid card with image fallback
│   │   │   ├── ImageCarousel.jsx  # Thumbnail gallery with navigation
│   │   │   ├── CartItem.jsx       # Cart line item with qty controls
│   │   │   ├── OrderSummary.jsx   # Price breakdown (subtotal/tax/total)
│   │   │   ├── Skeleton.jsx       # Loading placeholders
│   │   │   └── Footer.jsx         # Site footer with links
│   │   ├── context/
│   │   │   └── CartContext.js     # Cart state + toast notifications
│   │   └── lib/
│   │       └── api.js             # Axios client with interceptors
│   ├── next.config.mjs
│   └── .env.local
├── backend/                        # Express.js API
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js              # PostgreSQL pool + fallback detection
│   │   │   └── inMemoryStore.js   # In-memory data for zero-config mode
│   │   ├── routes/
│   │   │   ├── productRoutes.js
│   │   │   ├── cartRoutes.js
│   │   │   └── orderRoutes.js
│   │   ├── controllers/           # HTTP request/response handling
│   │   │   ├── productController.js
│   │   │   ├── cartController.js
│   │   │   └── orderController.js
│   │   ├── services/              # Business logic layer
│   │   │   ├── productService.js
│   │   │   ├── cartService.js
│   │   │   └── orderService.js
│   │   ├── models/
│   │   │   └── queries.js         # Centralized SQL query constants
│   │   ├── middleware/
│   │   │   └── errorHandler.js    # AppError class + error middleware
│   │   └── app.js                 # Express app configuration
│   ├── db/
│   │   ├── schema.sql             # Database tables + indexes
│   │   └── seed.sql               # Sample data (20 products)
│   ├── server.js                  # Entry point
│   ├── package.json
│   └── .env
└── README.md
```

---

## 🗄 Database Schema

### Entity Relationship Diagram

```
users (1) ──── (N) carts (1) ──── (N) cart_items (N) ──── (1) products
users (1) ──── (N) orders (1) ──── (N) order_items (N) ──── (1) products
```

### Tables

| Table         | Description                              | Key Constraints                              |
|---------------|------------------------------------------|----------------------------------------------|
| `users`       | User accounts                            | Unique email                                 |
| `products`    | Product catalog                          | CHECK constraints on price, stock, rating    |
| `carts`       | Shopping carts (1 per user)              | UNIQUE user_id (one active cart per user)     |
| `cart_items`  | Items in a cart                          | UNIQUE(cart_id, product_id), FK cascades     |
| `orders`      | Placed orders                            | FK to users, status defaults to 'pending'    |
| `order_items` | Items in an order (price snapshot)       | `price` stores price at time of purchase     |

### Why `cart_items` Exists (One-to-Many Relationship)

A cart can contain **multiple products**, each with its own **quantity**. Instead of storing an array of products inside the `carts` table (which would violate 1NF and make updates expensive), we use a **junction table** `cart_items`:

```sql
-- Each row represents one product in a user's cart
cart_items: { id, cart_id (FK→carts), product_id (FK→products), quantity }
```

This enables:
- **Adding a product**: Single INSERT (or UPSERT to increment quantity)
- **Updating quantity**: UPDATE by cart_item id, no array manipulation
- **Removing a product**: DELETE by cart_item id
- **Getting cart with product details**: Simple JOIN between `cart_items` and `products`

The `UNIQUE(cart_id, product_id)` constraint prevents duplicate entries — if a user adds the same product twice, the `ON CONFLICT DO UPDATE` clause increments the quantity atomically.

### Why `order_items` Exists (Price Snapshot Logic)

When a user places an order, we **snapshot the product price** into `order_items.price`:

```sql
order_items: { id, order_id, product_id, quantity, price }
--                                                  ^^^^^
--                              Price at the time of purchase, NOT a FK
```

**Why not just reference `products.price`?** Because product prices can change after an order is placed. If we only stored `product_id`, then viewing order history would show the **current** price—not what the customer actually paid. The snapshot ensures:

- Order history is always accurate
- Price changes don't retroactively affect past orders
- Financial reporting remains consistent

This is the same pattern used by Amazon, Shopify, and every real e-commerce platform.

### Design Decisions

- **Normalized schema** — No redundant data across tables
- **Foreign keys with CASCADE** — Automatic cleanup when parent records are deleted
- **CHECK constraints** — Enforce data integrity (`price >= 0`, `stock >= 0`, `rating 0-5`)
- **GIN index on product title** — Enables fast full-text search
- **B-tree indexes** — On category, cart_id, order_id, user_id for query performance

---

## 🔌 API Endpoints

### Products

| Method | Endpoint                | Description                           |
|--------|-------------------------|---------------------------------------|
| GET    | `/api/products`         | List all products (`?category=`)      |
| GET    | `/api/products/search`  | Search products (`?q=`)               |
| GET    | `/api/products/categories` | Get all distinct categories        |
| GET    | `/api/products/:id`     | Get single product by ID              |

### Cart

| Method | Endpoint                | Body                                | Description              |
|--------|-------------------------|-------------------------------------|--------------------------|
| GET    | `/api/cart`             | —                                   | Get cart contents        |
| POST   | `/api/cart/add`         | `{ product_id, quantity }`          | Add item to cart         |
| PUT    | `/api/cart/update`      | `{ cart_item_id, quantity }`        | Update item quantity     |
| DELETE | `/api/cart/remove/:id`  | —                                   | Remove item from cart    |

### Orders

| Method | Endpoint                | Body                 | Description              |
|--------|-------------------------|----------------------|--------------------------|
| POST   | `/api/orders`           | `{ address }`        | Place order from cart    |
| GET    | `/api/orders/:id`       | —                    | Get order details        |

### Health Check

| Method | Endpoint            | Description                                    |
|--------|---------------------|------------------------------------------------|
| GET    | `/api/health`       | Returns server status and mode (in-memory/pg)  |

### Response Format

All endpoints return a consistent JSON structure:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional context message"
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "message": "Human-readable error description"
  }
}
```

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** v18+ (recommended v20)
- **npm** v9+
- **PostgreSQL** database — *optional* (app works without it via in-memory mode)

### Quick Start (No Database Required)

```bash
# Terminal 1 — Backend
cd backend
npm install
npm run dev
# Server starts at http://localhost:5000 in in-memory mode

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
# App starts at http://localhost:3000
```

Open `http://localhost:3000` — 20 products load immediately.

### With PostgreSQL (Persistent Storage)

1. Go to [Supabase](https://supabase.com) and create a new project
2. Navigate to **SQL Editor** in the Supabase dashboard
3. Run `backend/db/schema.sql` → creates tables and indexes
4. Run `backend/db/seed.sql` → inserts 20 sample products
5. Copy your connection string from **Settings → Database → Connection String → URI**
6. Update `backend/.env`:

```env
PORT=5000
DATABASE_URL=postgresql://postgres.[YOUR-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

7. Restart the backend — it auto-detects the valid URL and connects to PostgreSQL

### Verify Everything Works

1. `http://localhost:3000` — see the product grid with 20 items
2. Use the sort dropdown — sort by price, rating, or reviews
3. Click a product — see detail page with image carousel + related products
4. Add to cart — toast notification appears, navbar badge updates
5. Go to cart — manage quantities with +/- buttons
6. Checkout — fill address form, place order
7. Order success — see confirmation with order ID

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable       | Description                          | Required |
|----------------|--------------------------------------|----------|
| `PORT`         | Server port (default: 5000)          | No       |
| `DATABASE_URL` | PostgreSQL connection string         | No*      |

*If `DATABASE_URL` is missing or invalid, the app runs in in-memory mode. No database needed.

### Frontend (`frontend/.env.local`)

| Variable               | Description                   | Required |
|-------------------------|-------------------------------|----------|
| `NEXT_PUBLIC_API_URL`   | Backend API base URL          | Yes      |

---

## ✨ Features

### Core Features
- ✅ Product listing with responsive grid layout (2-5 columns)
- ✅ Search with debounce (400ms) across title, description, and category
- ✅ Filter by category (5 categories)
- ✅ **Sort products** (price low/high, rating, reviews) — *differentiator*
- ✅ Product detail with image carousel (3 images per product)
- ✅ **Related products** section on product page — *differentiator*
- ✅ Persistent shopping cart (database-backed)
- ✅ Add/update/remove cart items with quantity controls
- ✅ Checkout with address form validation (including format checks)
- ✅ Order placement with stock management (transactional)
- ✅ Order confirmation page with full details

### UI/UX
- ✅ Amazon-inspired design (dark header, orange accents, yellow CTAs)
- ✅ Responsive design (mobile → desktop)
- ✅ Skeleton loading states with shimmer animation for all pages
- ✅ Toast notifications (add to cart, remove, order placed)
- ✅ Error states with retry button
- ✅ Empty states (empty cart, no search results)
- ✅ Hover effects and micro-animations (scale, shadow, color transitions)
- ✅ Click feedback (active:scale on buttons)
- ✅ Image fallback handling on every page (broken images show placeholder SVG)
- ✅ Star ratings with half-star support
- ✅ Stock status badges (In Stock / Only X left / Out of Stock)
- ✅ Out-of-stock products disabled in UI
- ✅ Accessible UI with aria-labels on interactive elements

### Engineering
- ✅ Clean architecture (routes → controllers → services → models)
- ✅ Dual-mode backend (PostgreSQL or in-memory — zero config)
- ✅ Centralized error handling with AppError class
- ✅ React Context for state management with toast system
- ✅ Database transactions for order placement (atomicity)
- ✅ UPSERT for cart item management (ON CONFLICT)
- ✅ SQL injection prevention (parameterized queries)
- ✅ Input validation at service layer
- ✅ Consistent JSON API response format
- ✅ Centralized API client with error interceptors
- ✅ CORS configured for development and production
- ✅ No console noise in production

---

## 🏗 Architecture Decisions

### Why Raw SQL over ORM?
Demonstrates understanding of SQL, database design, and query optimization. In an interview, you can explain JOIN operations, indexing strategies, and transaction management without relying on ORM abstractions.

### Why React Context over Redux/Zustand?
For cart-scoped state, Context API is the right tool — simple, built-in, and sufficient. We use `useCallback` on all context functions to prevent unnecessary re-renders. No additional dependency needed.

### Why UPSERT for Cart?
The `ON CONFLICT DO UPDATE` pattern prevents duplicate cart entries and atomically handles "add more of the same product" in a single query — no race conditions.

### Why Price Snapshot in Order Items?
Stores the price at the time of purchase. If product prices change later, historical order data remains accurate. This is standard practice in all real e-commerce systems.

### Why Database Transactions for Orders?
Order creation involves multiple operations (create order → create order items → decrease stock → clear cart). A `BEGIN/COMMIT/ROLLBACK` transaction ensures all-or-nothing consistency — if stock is insufficient, the entire operation rolls back.

### Why Dual-Mode Backend?
Allows the app to run out-of-the-box without requiring the evaluator to set up a database. The `isInMemoryMode()` check is injected at the service layer, so controllers and routes remain unchanged between modes.

### Why Client-Side Sorting?
With 20 products, sorting in the browser is instant and avoids extra API roundtrips. For a production app with thousands of products, this would be moved server-side with `ORDER BY` clauses and pagination.

---

## 🎤 Interview Talking Points

### "Why this schema?"
- **Normalized to 3NF** — no data redundancy
- `cart_items` is a junction table enabling many-to-many between carts and products
- `order_items.price` is a **snapshot** — decoupled from current product price for data integrity
- CHECK constraints enforce business rules at the database level

### "Why a service layer?"
- **Separation of concerns** — controllers handle HTTP, services handle business logic
- Makes the code **testable** — you can unit test services without Express
- **Swappable data layer** — the `isInMemoryMode()` check lives in services, not controllers
- Controllers don't know (or care) whether data comes from PostgreSQL or memory

### "How does data flow?"
- User action → React component → Context method → Axios API call → Express route → Controller → Service → Database/Memory → Response flows back up
- State management is centralized in CartContext — any component can read cart count, add items, or show toasts
- Backend uses a consistent `{ success, data, error }` JSON envelope for all responses

### "How do you handle edge cases?"
- **Out of stock**: Button disabled, overlay shown, stock check in DB transaction
- **Broken images**: `onError` handlers on every `<img>` tag across all pages
- **Server down**: Network error detection with user-friendly message + retry button
- **Empty states**: Custom UI for empty cart, no search results, and failed API calls
- **Form validation**: Required fields + format validation for phone/ZIP
- **Race conditions**: UPSERT prevents duplicate cart items, transactions prevent overselling

---

## 🌐 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import repository in [Vercel](https://vercel.com)
3. Set root directory to `frontend`
4. Add environment variable: `NEXT_PUBLIC_API_URL=<your-backend-url>/api`
5. Deploy

### Backend (Render)
1. Push code to GitHub
2. Create a new **Web Service** in [Render](https://render.com)
3. Set root directory to `backend`
4. Set build command: `npm install`
5. Set start command: `node server.js`
6. Add environment variables: `DATABASE_URL`, `PORT`
7. Deploy

---

## 📝 Assumptions

1. A default user (id=1, "John Doe") is always logged in — no authentication
2. Product images use Unsplash URLs (with SVG fallback for broken links)
3. Tax is estimated at 8% (configurable in OrderSummary component)
4. Shipping is free for orders over $25
5. Maximum 10 of any single item can be added to cart
6. In-memory mode: data resets on server restart

---

## 📄 License

This project is built for educational/evaluation purposes.
