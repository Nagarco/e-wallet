# 💳 E-Wallet Transaction Engine

## 📌 Project Overview

This project implements a core banking/wallet transaction engine. In financial systems, the primary engineering challenge is preventing race conditions, balance inconsistencies, and deadlocks when multiple concurrent transfers occur simultaneously.

This API handles account lifecycle, balance adjustments, and atomic fund transfers with transactional guarantees and pessimistic row-level locking.

## 🚀 Key Features & Highlights

- **🔒 Atomic Transactions & ACID Compliance**: Transfers execute inside isolated database transactions (`DataSource.transaction`), guaranteeing that money is neither created nor lost if any step fails.
- **🛡️ Deadlock Prevention & Concurrency Control**:
  - Implements **pessimistic write locking** (`SELECT ... FOR UPDATE`) to prevent double-spending and dirty reads.
  - Applies a **deterministic lock ordering algorithm** (sorting account IDs before acquiring locks) to mathematically eliminate circular wait conditions and deadlock risks across concurrent transfers.
- **📊 Transfer State Tracking**: Full auditability with explicit state tracking (`Pending` ➔ `Fulfilled` / `Failed`).
- **🛡️ Robust Input Validation & Sanitization**: Comprehensive payload validation using `class-validator` and `class-transformer` with strict whitelist checks.
- **⚡ Paginated Audit History**: Efficient cursor/offset pagination for transaction records with eager/lazy relation metadata.
- **🏗️ Database Migrations**: Reproducible database schema lifecycle management via TypeORM migrations.

---

## 🛠️ Tech Stack & Architecture

- **Runtime & Language**: Node.js (ES Modules), TypeScript
- **Framework**: [NestJS](https://nestjs.com/) (Modular Architecture, Dependency Injection)
- **Database**: PostgreSQL
- **ORM & Data Layer**: TypeORM (Pessimistic Locking, Migrations, Entity Repositories)
- **Validation**: `class-validator`, `class-transformer`
- **Testing & Quality**: Vitest, Supertest, Oxlint, Prettier

---

## 🏛️ System Design & Concurrency Strategy

### Deadlock-Free Transfer Workflow
When two users concurrently transfer money to each other (e.g., User A sends to User B while User B sends to User A), acquiring locks in arbitrary order can cause a database deadlock.

To prevent this:
1. The service evaluates both account IDs and sorts them deterministically:
   $$\text{firstId} = \min(\text{senderId}, \text{receiverId}), \quad \text{secondId} = \max(\text{senderId}, \text{receiverId})$$
2. Pessimistic write locks (`pessimistic_write`) are obtained strictly in ascending order.
3. Balance checks, account deductions, additions, and transfer record updates execute atomically in the same database transaction.
4. Any runtime error or insufficient balance immediately rolls back the transaction and marks the transfer status as `Failed`.

---

## 🔌 API Endpoints

### 1. Accounts (`/account`)

| Method | Endpoint | Description | Sample Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/account` | Register a new wallet account | `{"phoneNumber": "01012345678", "balance": 100.00}` |
| `PUT` | `/account/add-balance` | Deposit / top-up wallet balance | `{"phoneNumber": "01012345678", "amount": 50.00}` |
| `DELETE` | `/account/:id` | Remove an account | _None_ |

### 2. Transfers (`/transfer`)

| Method | Endpoint | Description | Query / Sample Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/transfer` | Execute peer-to-peer transfer | `{"senderPhone": "01012345678", "receiverPhone": "01087654321", "amount": 25.50}` |
| `GET` | `/transfer` | Get paginated transfer history | `?page=1&limit=10` |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- PostgreSQL database instance

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd e-wallet
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_NAME=ewallet
```

### 3. Run Migrations
```bash
npm run migration:run
```

### 4. Start the Application
```bash
# Development mode with hot-reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

### 5. Running Tests & Linter
```bash
# Unit & integration tests
npm run test

# End-to-end tests
npm run test:e2e

# Code style & linting
npm run lint
```