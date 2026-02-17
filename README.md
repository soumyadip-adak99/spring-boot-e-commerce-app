# ShopHub E-Commerce Platform

A robust, full-stack e-commerce application built with Spring Boot and React. ShopHub offers a seamless shopping experience with features like user authentication, product management, shopping cart, secure checkout, and order tracking.

![ShopHub Banner](https://via.placeholder.com/1200x400?text=ShopHub+E-Commerce)

## 🚀 Key Features

*   **User Authentication**: Secure login and registration using JWT and Google OAuth2.
*   **Product Catalog**: Browse and search products with advanced filtering and sorting.
*   **Product Details**: Detailed product pages with images, descriptions, ratings, and reviews.
*   **Shopping Cart**: Add items, update quantities, and manage your cart effortlessly.
*   **Secure Checkout**: Integrated Razorpay payment gateway for secure transactions.
*   **Order Management**: Track order status and view order history.
*   **Admin Dashboard**: Manage products, users, and orders (Admin Panel).
*   **Responsive Design**: Optimized for both desktop and mobile devices.
*   **Image Uploads**: Cloudinary integration for efficient image management.

## 🛠️ Tech Stack

### Backend
*   **Framework**: Spring Boot 3.4.2 (Java 21)
*   **Database**: MongoDB
*   **Caching**: Redis
*   **Security**: Spring Security, OAuth2 Client, JWT
*   **Payment**: Razorpay SDK
*   **Testing**: Spring Boot Test
*   **Build Tool**: Maven

### Frontend (Client & Admin)
*   **Framework**: React 19 (Vite)
*   **State Management**: Redux Toolkit
*   **Styling**: Tailwind CSS 4, Material Tailwind, DaisyUI
*   **Routing**: React Router DOM 7
*   **HTTP Client**: Axios / Fetch API
*   **Icons**: Lucide React

## ⚙️ Environment Variables

To run this project, you will need to add the following environment variables to your `backend/src/main/resources/application.yml` or run configuration:

```yaml
# Database
MONGODB_URI: mongodb://localhost:27017
MONGODB_DATABASE: shophub_db
REDIS_HOST: localhost
REDIS_PORT: 6379

# Mail
MAIL_USERNAME: your_email@gmail.com
MAIL_PASSWORD: your_app_password

# Authentication (Google OAuth2)
SECURITY_OAUTH2_GOOGLE_CLIENT_ID: your_google_client_id
SECURITY_OAUTH2_GOOGLE_CLIENT_SECRET: your_google_client_secret

# JWT
JWT_SECRET: your_long_random_secret_string
JWT_TIMEOUT: 86400000 # 24 hours

# Cloudinary
CLOUDINARY_CLOUD_NAME: your_cloud_name
CLOUDINARY_API_KEY: your_api_key
CLOUDINARY_API_SECRET: your_api_secret

# Razorpay
RAZORPAY_KEY_ID: your_razorpay_key_id
RAZORPAY_KEY_SECRET: your_razorpay_key_secret
```

Client-side environment variables (`client/.env`):
```env
VITE_BACKEND_BASE_API=http://localhost:8081/api/v1
```

## 📦 Installation & Setup

### Prerequisites
*   Java JDK 21+
*   Node.js 18+ & npm
*   MongoDB (Running locally or Atlas URI)
*   Redis (Running locally)

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    ./mvnw clean install
    ```
3.  Run the application:
    ```bash
    ./mvnw spring-boot:run
    ```
    The backend server will start on `http://localhost:8081`.

### Frontend Setup

1.  Navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:5173`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.