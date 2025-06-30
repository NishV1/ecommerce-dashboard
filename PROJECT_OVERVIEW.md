# E-commerce Dashboard

A comprehensive full-stack e-commerce marketplace application built with React.js frontend and Node.js/Express backend with MongoDB database.

## Features

### 🔐 Authentication & Security
- User registration and login
- JWT token-based authentication
- Protected routes and middleware
- Password hashing with bcryptjs
- Input validation and sanitization
- Secure API endpoints

### 📦 Product Management
- View all products (public) with pagination
- Add new products (authenticated users)
- Edit existing products (product owners only)  
- Delete products (product owners only)
- Product view counter (increments once per visit)
- Image upload support
- Rich product details with descriptions

### 🔍 Advanced Search & Filtering
- Real-time search by name, brand, or category
- Advanced filtering by category, brand, price range
- Multiple sorting options (date, price, name, popularity)
- Pagination for large product catalogs
- Filter metadata API for dynamic filter options
- Search input that allows typing without triggering search on every keystroke

### ❤️ Wishlist System
- Add/remove products to/from wishlist
- Personal wishlist page for each user
- Quick wishlist status checking
- Integration with product browsing

### 📞 Contact & Communication
- Contact seller functionality for product inquiries
- Seller inquiry dashboard to manage received messages
- Modal-based contact forms
- Email and message tracking for sellers

### 👤 User Management
- Comprehensive user profiles with statistics
- View user's own products
- User authorization for all operations
- Product ownership verification

### 🎨 Modern UI/UX
- Fully responsive design for all screen sizes
- Clean and modern interface with professional styling
- Loading states and comprehensive error handling
- Gradient backgrounds and smooth animations
- Modal dialogs for enhanced user experience
- Intuitive navigation and user flows
- Mobile-optimized layouts

## Technology Stack

### Frontend
- **React 18.3.1** - JavaScript library for building user interfaces
- **React Router DOM 6.30.0** - Declarative routing for React
- **CSS3** - Modern styling with flexbox, grid, and advanced responsive design
- **Fetch API** - For HTTP requests to backend APIs

### Backend  
- **Node.js** - JavaScript runtime environment
- **Express.js 4.21.2** - Web application framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose 8.14.1** - MongoDB object modeling with schema validation

### Security & Authentication
- **bcryptjs 2.4.3** - Password hashing and verification
- **jsonwebtoken 9.0.2** - JWT token authentication and authorization
- **cors 2.8.5** - Cross-origin resource sharing configuration
- **dotenv 16.4.5** - Environment variable management

### Database Models
- **Users** - Authentication and profile management
- **Products** - Product catalog with view tracking
- **Wishlist** - User wishlist functionality
- **Contact** - Seller inquiry system

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

### Getting Started
1. **Registration/Login**: Create an account or sign in to access full functionality
2. **Browse Products**: View all products on the main page with pagination
3. **Search & Filter**: Use advanced search and filtering to find specific products
4. **Product Details**: Click on any product to view detailed information

### For Buyers
5. **Wishlist**: Add products to your wishlist for later viewing
6. **Contact Sellers**: Send inquiries directly to product owners
7. **Track Views**: See how popular products are with view counts

### For Sellers  
8. **Add Products**: Create new product listings with detailed information
9. **Manage Products**: Edit or delete your own products
10. **Handle Inquiries**: View and respond to buyer inquiries in your dashboard
11. **Profile Management**: View your profile statistics and product performance

### Navigation Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Search**: Type and search without delays
- **Pagination**: Navigate through large product catalogs efficiently
- **Modern UI**: Enjoy a clean, professional interface

## API Endpoints

For detailed API documentation, see `backend/API_DOCUMENTATION.md`

## Security Features

- **Password Security**: Robust password hashing using bcryptjs
- **JWT Authentication**: Secure token-based authentication system
- **Input Validation**: Comprehensive validation on both frontend and backend
- **User Authorization**: Strict permission system for product operations
- **Environment Security**: Sensitive data stored in environment variables
- **CORS Configuration**: Secure cross-origin request handling
- **Protected Routes**: Authentication required for sensitive operations
- **Middleware Protection**: Server-side route protection with JWT verification

## Recent Updates & Bug Fixes

### Performance Improvements
- **View Counter Optimization**: Fixed double-increment issue using useRef
- **Search Input Enhancement**: Separated input state to allow typing without triggering search on every keystroke
- **Pagination**: Implemented efficient pagination for better performance with large datasets

### New Features Added
- **Advanced Product Filtering**: Category, brand, price range, and sorting options
- **Wishlist System**: Complete wishlist functionality with dedicated page
- **Contact Seller**: Direct communication system between buyers and sellers
- **Seller Dashboard**: Inquiry management system for sellers
- **View Tracking**: Product popularity tracking with view counters
- **Responsive Design**: Mobile-optimized UI across all components

### Technical Improvements
- **API Standardization**: Consistent response formats across all endpoints
- **Error Handling**: Comprehensive error handling and user feedback
- **Code Organization**: Modular component structure for maintainability
- **Database Models**: Proper schema design for scalability
