# Login and sign up flow

This repository contains a basic user system for a web application.
## Email set up

1. Create a new gmail for yourself (it works with any provider but some authorizations may vary)

2. Set up 2FA for your new google account

3. Create a new app password with "email" as the app name

## Installation

1. Install the dependencies:

    ```bash
    npm install
    ```

3. Copy the .env.example file to a new file named `.env`.

    ```bash
    cp .env.example .env
    ```

4. Open the `.env` file and replace the placeholders:

    ```bash
    EMAIL='your_email_here_'
    EMAIL_PASSWORD='your_app_password_here'
    JWT_SECRET = 'yout_random_jwt_secret'
    SITE_HOST = 'localhost'
    PORT = '8080'
    ```
## How to Use the code

1. Run the server:

    ```bash
    npm run dev
    ```

2. Open your browser and search for `http://localhost:8080`.

3. Make sure to be connected to the network to be able to send emails 