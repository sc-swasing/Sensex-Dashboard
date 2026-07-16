# 📈 Sensex Dashboard

<p align="center">
  <img src="https://img.shields.io/badge/Angular-22-red?style=for-the-badge&logo=angular" />
  <img src="https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql" />
  <img src="https://img.shields.io/badge/JWT-Authentication-orange?style=for-the-badge" />
</p>

<p align="center">
A full-stack web application that displays Sensex stock market data with secure authentication, pagination, search, and interactive visualization..
</p>

---

# 🚀 Features

✅ JWT Authentication

✅ Paginated Data (30 rows per page)

✅ Search Functionality

✅ PostgreSQL Database

✅ REST APIs using Express.js

✅ Angular Standalone Components

✅ Responsive UI

✅ Interactive Stock Chart

---

# 🛠 Tech Stack

| Frontend | Backend | Database | Authentication |
|-----------|----------|-----------|----------------|
| Angular 22 | Node.js | PostgreSQL | JWT |
| TypeScript | Express.js | SQL | Bearer Token |
| Chart.js | REST API | pg | bcrypt |

---

# 📂 Project Structure

```text
Assignment_01/
│
└── sensex-dashboard/
    │
    ├── backend/
    │   ├── middleware/
    │   │   └── auth.js
    │   ├── node_modules/
    │   ├── db.js
    │   ├── importData.js
    │   ├── server.js
    │   ├── Sensex_CSV_2018.csv
    │   ├── package.json
    │   └── package-lock.json
    │
    ├── frontend/
    │   ├── node_modules/
    │   ├── public/
    │   ├── src/
    │   │   ├── app/
    │   │   │   ├── dashboard/
    │   │   │   ├── login/
    │   │   │   ├── register/
    │   │   │   ├── models/
    │   │   │   ├── services/
    │   │   │   ├── app.html
    │   │   │   ├── app.ts
    │   │   │   ├── app.routes.ts
    │   │   │   ├── app.spec.ts
    │   │   │   └── auth.interceptor.ts
    │   │   │
    │   │   ├── assets/
    │   │   ├── index.html
    │   │   ├── main.ts
    │   │   └── styles.css
    │   │
    │   ├── angular.json
    │   ├── package.json
    │   ├── package-lock.json
    │   ├── tsconfig.json
    │   └── .prettierrc
    │
    ├── .editorconfig
    ├── .gitignore
    └── README.md
```
```

---

# ⚙ Prerequisites

Install the following software before running the project.

- Node.js
- npm
- Angular CLI
- PostgreSQL

Verify installation

```bash
node -v
npm -v
ng version
psql --version
```

---

# 📦 Backend Setup

Navigate to backend folder

```bash
cd backend
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=sensexdb
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_secret_key
```

Run backend

```bash
node server.js
```

Backend runs on

```
http://localhost:3000
```

---

# 💻 Frontend Setup

Navigate to frontend

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Run Angular

```bash
ng serve
```

Application runs on

```
http://localhost:4200
```

---

# 🔐 Authentication

Login Endpoint

```
POST /login
```

Sample Request

```json
{
    "username":"admin",
    "password":"password"
}
```

Response

```json
{
   "token":"JWT_TOKEN"
}
```

Pass the token in every API request

```
Authorization: Bearer <JWT_TOKEN>
```

---

# 📡 API Endpoints

## Login

```
POST /login
```

---

## Get Sensex Data

```
GET /api/sensex?page=1&limit=30&search=
```

### Query Parameters

| Parameter | Description |
|------------|-------------|
| page | Current page number |
| limit | Number of records |
| search | Search by trade date |

---

# 🗄 Database Schema

Table : **sensex**

| Column | Type |
|---------|------|
| trade_date | DATE |
| open | NUMERIC |
| close | NUMERIC |

---

# 🌍 Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | Backend Port |
| DB_HOST | Database Host |
| DB_PORT | PostgreSQL Port |
| DB_NAME | Database Name |
| DB_USER | Database Username |
| DB_PASSWORD | Database Password |
| JWT_SECRET | JWT Secret Key |

---

# ▶ Running the Project

### Start Backend

```bash
cd backend
node server.js
```

### Start Frontend

```bash
cd frontend
ng serve
```

Open browser

```
http://localhost:4200
```

---

# 📸 Application Modules

- 🔑 Login Page
- 📊 Dashboard
- 📈 Stock Price Chart
- 🔍 Search
- 📑 Pagination

---

# 🔒 Security

- JWT Authentication
- Protected REST APIs
- Authorization Header Validation

---

# 👩‍💻 Author

**Swati Singh**


```
