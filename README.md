# 🧾 Point of Sales (POS)

## 📌 Description

Project Point of Sales (POS) ini merupakan project latihan mandiri yang saya kembangkan untuk mempelajari backend development menggunakan Node.js, Express, TypeScript, dan Prisma ORM.

Saat ini fokus utama pada pengembangan backend seperti autentikasi, manajemen user, serta role-based access (ADMIN & CASHIER). Frontend akan ditambahkan secara bertahap untuk menjadikan project ini sebagai aplikasi fullstack.

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

## 📁 Project Structure

src/
├── controllers/
├── services/
├── repositories/
├── routes/
├── middleware/
├── validations/
├── dto/
├── lib/
│ └── prisma.ts
└── index.ts

---

## 🔐 Features

- User Authentication (Register & Login)
- Role-based Access Control (ADMIN / CASHIER)
- User Management (CRUD)
- Soft Delete Implementation
- Input Validation using Zod
- JWT Authentication

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