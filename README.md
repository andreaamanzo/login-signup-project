# 🚀 Login & Signup Flow (Fastify + MySQL + Docker)

This project is an **authentication system built with Fastify**, supporting **JWT-based login/signup**, **email verification via Nodemailer**, and persistent user storage with **MySQL**.
Perfect for building lightweight and modern authentication flows.

---

## 🐳 Requirements

- [Docker](https://www.docker.com/) installed
- Node.js ≥ v18 (if you want to run without Docker)
- A valid email account for sending verification emails (e.g., Gmail with App Password)

---

## ✉️ Email Setup

1. Create a Gmail account (or another provider).
2. Enable Two-Factor Authentication (2FA).
3. Generate an **App Password**, and use it as `EMAIL_PASSWORD` in your `.env` file.

---


## 📁 Installation

1. Clone the repository:

```bash
git clone https://github.com/andreaamanzo/login-signup-project.git
cd login-signup-project
```

2. Install dependencies:

```bash
npm install
```

3. Copy the example environment file:

```bash
cp .env.example .env
```

4. Fill in your `.env` file:

```env
EMAIL='your_email_here'
EMAIL_PASSWORD='your_app_password_here'
JWT_SECRET='your_random_jwt_secret'
SITE_HOST='localhost'
PORT='8080'

DB_HOST='mysql-container'
DB_USER='your_mysql_user'
DB_PASSWORD='your_mysql_password'
DB_NAME='your_database_name'
```

---


## 🐋 Run with Docker

To start the app and the MySQL database with Docker:

```bash
sudo docker compose up --build
```

The backend will be available at: [http://localhost:8080](http://localhost:8080)

---

## 💠 Development Mode

To run locally without Docker:

1. Ensure your MySQL database is up and running.
2. Start the development server:

```bash
npm run dev
```

---


## 🧠 Features

- ✅ Sign up with email and password
- ✅ Email verification link
- ✅ JWT-based login
- ✅ Reset password via email
- ✅ Argon2 secure password hashing
- ✅ MySQL connection pool and async queries

---

