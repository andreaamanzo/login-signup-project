# 🚀 Login & Signup Flow (Fastify)

This repository contains a **Fastify-based authentication system** with **JWT-based login/signup** and email verification via **Nodemailer**.  
It is designed for lightweight and fast user authentication.

## ✉️ Email Setup

1. Create a new Gmail account (other providers work, but authentication steps may vary).
2. Enable **2FA (Two-Factor Authentication)** on your Google account.
3. Generate an **App Password** with `"email"` as the app name.

## 📦 Installation

1. Clone the repository and install dependencies:

    ```bash
    git clone https://github.com/andreaamanzo/login-signup-project.git
    cd login-signup-project
    npm install
    ```

2. Copy the `.env.example` file to `.env`:

    ```bash
    cp .env.example .env
    ```

3. Open `.env` and replace placeholders:

    ```env
    EMAIL='your_email_here'
    EMAIL_PASSWORD='your_app_password_here'
    JWT_SECRET='your_random_jwt_secret'
    SITE_HOST='localhost'
    PORT='8080'
    ```

## 🚀 Running the Server

Start the development server:

```bash
npm run dev
```

Then, open your browser and go to: http://localhost:8080.

Ensure you're connected to the network to enable email sending.
