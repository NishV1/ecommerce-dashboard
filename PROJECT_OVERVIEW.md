# E-commerce Dashboard

A full-stack e-commerce dashboard application built with React.js frontend and Node.js/Express backend with MongoDB database.

## Features

### 🔐 Authentication
- User registration and login
- JWT token-based authentication
- Protected routes
- Password hashing with bcryptjs

### 📦 Product Management
- View all products (public)
- Add new products (authenticated users)
- Edit existing products (product owners only)
- Delete products (product owners only)
- Search products by name, brand, or category

### 👤 User Management
- User profile with statistics
- View user's own products
- User authorization for product operations

### 🎨 Modern UI
- Responsive design
- Clean and modern interface
- Loading states and error handling
- Gradient backgrounds and smooth animations

## Technology Stack

### Frontend
- **React 18.3.1** - JavaScript library for building user interfaces
- **React Router DOM 6.30.0** - Declarative routing for React
- **CSS3** - Modern styling with flexbox and grid

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js 4.21.2** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose 8.14.1** - MongoDB object modeling

### Security & Authentication
- **bcryptjs 2.4.3** - Password hashing
- **jsonwebtoken 9.0.2** - JWT token authentication
- **cors 2.8.5** - Cross-origin resource sharing
- **dotenv 16.4.5** - Environment variable management

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```env
   DB_URI=mongodb://localhost:27017/e-comm
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   ```

4. Start MongoDB service on your machine

5. Start the backend server:
   ```bash
   npm run dev
   ```

   The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000`

## Usage

1. **Registration/Login**: Start by creating an account or logging in
2. **View Products**: Browse all products on the main page
3. **Add Products**: Use the "Add Product" page to create new products
4. **Manage Products**: Edit or delete your own products
5. **Search**: Use the search functionality to find specific products
6. **Profile**: View your profile and manage your products

## API Endpoints

For detailed API documentation, see `backend/API_DOCUMENTATION.md`

## Security Features

- Password hashing using bcryptjs
- JWT token authentication
- Input validation on both frontend and backend
- User authorization for product operations
- Environment variables for sensitive data
- CORS configuration for secure cross-origin requests
