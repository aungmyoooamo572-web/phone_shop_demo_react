# Phone Shop Demo - React Frontend (Bento Grid Spec Style)

Modern clean e-commerce web application for smartphones built with **React 19**, **TypeScript**, **Bootstrap 5**, and **Bootstrap Icons**, designed with a futuristic Bento Grid aesthetic. Fully integrated with a Spring Boot REST API backend.

---

## 🚀 Features

- **Bento Grid Showcase (`BentoHero`)**: Visually engaging flagship phone highlight with responsive specs tiles.
- **Specification Matrix (`PhoneDetailPage`)**: Dynamic Bento Grid display for processor, screen, battery, and operating system.
- **Variant Selector**: Seamless switching between colors, RAM, storage, live pricing (MMK), and stock check.
- **Shopping Cart**: Real-time quantity adjustments, cart totals, and automatic DB synchronization.
- **Checkout & Order Flow**: Shipping address validation, notes, order placement, and automatic cart clearing.
- **Payment Gateway (`PaymentPage`)**: Support for KBZPay (KPay), WavePay, Bank Transfer, and Cash on Delivery (COD) with payment slip uploading and transaction ID verification.
- **Order Tracking (`MyOrdersPage`)**: Live order status badges (`PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`) with tracking numbers.
- **Admin Dashboard (`AdminDashboardPage`)**:
  - Live inventory and variant stock monitoring (< 5 low stock alerts).
  - Order status and delivery tracking updates.
  - 1-click payment slip verification (auto-decrements variant stock and confirms order).
- **Authentication**: JWT token management with Axios interceptors and pre-configured demo test buttons (`admin` & `customer`).

---

## 🛠 Tech Stack

- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Bootstrap 5 + Bootstrap Icons + Custom Bento Dark Theme
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios with JWT Interceptors
- **Backend**: Spring Boot 4 + MySQL + Spring Security (JWT)

---

## 💻 Getting Started

### 1. Prerequisites
- Node.js (v18+ recommended)
- Spring Boot Backend running at `http://localhost:8080`

### 2. Installation
```bash
git clone https://github.com/aungmyoooamo572-web/phone_shop_demo_react.git
cd phone_shop_demo_react
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 👤 Demo Credentials
- **Admin**: `username: admin` | `password: admin123`
- **Customer**: `username: customer` | `password: pass123`
