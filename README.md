# 🧾 Point of Sales (POS)

## 📌 Description

Project Point of Sales (POS) ini merupakan project latihan mandiri yang saya kembangkan untuk mempelajari backend development menggunakan Node.js, Express, TypeScript, dan Prisma ORM.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod (Validation)
- JWT (Authentication)
- bcrypt (Password Hashing)

---

## 🔐 Features

- User Authentication (Register & Login)
- User Authorization (ADMIN/CASHIER)
- User Management (CRUD)
- Soft Delete Implementation
- Input Validation using Zod
- JWT Authentication
- Product Management (CRUD)
- Category Management (CRUD)
- Order Management (CRUD)
- Payment Integration (CASH & MIDTRANS)
- Midtrans Payment Gateway Integration (Snap API)
- Payment Webhook Handling (Auto update payment & order status)
- Input Validation using Zod
- Stock (auto decrease on order)
- API Pagination & Filtering

---

## 🧠 Architecture

Menggunakan layered architecture:

```

Controller → Service → Repository → Database

```

---

## ⚙️ Setup Project

### 1. Clone repository

```bash
git clone https://github.com/your-username/point-of-sales.git
cd point-of-sales
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup envirotment variables

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/pos_db"
JWT_SECRET="your-secret-key"
PORT=3000
MIDTRANS_SERVER_KEY = "your-midtrans-server-key"
MIDTRANS_CLIENT_KEY = "your-midtrans-client-key"

```

### 4. Prisma setup

```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Run Project Development

```bash
npm run dev
```
