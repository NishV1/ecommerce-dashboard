# Ecommerce Dashboard Backend API

## Base URL
```
http://localhost:5000
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Authentication

#### 1. User Registration
**POST** `/signup`

**Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "username": "johndoe",
  "email": "john@example.com",
  "token": "jwt_token"
}
```

#### 2. User Login
**POST** `/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "username": "johndoe",
  "email": "john@example.com",
  "token": "jwt_token"
}
```

### Products

#### 3. Get All Products (Public)
**GET** `/products`

**Response:**
```json
[
  {
    "_id": "product_id",
    "name": "Product Name",
    "price": 99.99,
    "brand": "Brand Name",
    "category": "Category",
    "description": "Product description",
    "image": "image_url",
    "views": 0,
    "userId": "user_id",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
]
```

#### 4. Advanced Product Filtering (Public)
**GET** `/products/filter`

**Query Parameters:**
- `search` - Search in name, brand, category
- `category` - Filter by category
- `brand` - Filter by brand
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `sortBy` - Sort field (createdAt, price, name, views)
- `sortOrder` - Sort direction (asc, desc)
- `page` - Page number for pagination
- `limit` - Items per page

**Example:**
```
GET /products/filter?search=laptop&category=Electronics&sortBy=price&sortOrder=asc&page=1&limit=10
```

**Response:**
```json
{
  "products": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalProducts": 50,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### 5. Get Product Metadata (Public)
**GET** `/products/meta`

**Response:**
```json
{
  "categories": ["Electronics", "Clothing", "Books"],
  "brands": ["Apple", "Samsung", "Nike"],
  "priceRange": {
    "minPrice": 0,
    "maxPrice": 1000
  }
}
```

#### 6. Get User's Products (Protected)
**GET** `/my-products`
**Headers:** `Authorization: Bearer <token>`

#### 7. Add New Product (Protected)
**POST** `/add-product`
**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "name": "New Product",
  "price": 49.99,
  "brand": "Brand Name",
  "category": "Electronics",
  "description": "Product description",
  "image": "image_url"
}
```
}
```

#### 8. Update Product (Protected)
**PUT** `/update-product/:id`
**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "name": "Updated Product",
  "price": 59.99,
  "brand": "Brand Name",
  "category": "Electronics",
  "description": "Updated description",
  "image": "new_image_url"
}
```

#### 9. Delete Product (Protected)
**DELETE** `/delete-product/:id`
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Product deleted successfully"
}
```

#### 10. Get Single Product (Public)
**GET** `/product/:id`

**Response:**
```json
{
  "_id": "product_id",
  "name": "Product Name",
  "price": 99.99,
  "brand": "Brand Name",
  "category": "Category",
  "description": "Product description",
  "image": "image_url",
  "views": 0,
  "userId": "user_id",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### 11. Increment Product Views (Public)
**POST** `/products/:id/view`

**Response:**
```json
{
  "message": "View count updated",
  "views": 1
}
```

#### 12. Search Products (Legacy - use filter endpoint instead)
**GET** `/search/:key`

Search in product name, brand, or category.

### Wishlist Management

#### 13. Add Product to Wishlist (Protected)
**POST** `/wishlist/add`
**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "productId": "product_id"
}
```

**Response:**
```json
{
  "message": "Product added to wishlist"
}
```

#### 14. Remove Product from Wishlist (Protected)
**DELETE** `/wishlist/remove/:productId`
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Product removed from wishlist"
}
```

#### 15. Check Wishlist Status (Protected)
**GET** `/wishlist/check/:productId`
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "inWishlist": true
}
```

#### 16. Get User's Wishlist (Protected)
**GET** `/wishlist`
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "_id": "wishlist_id",
    "userId": "user_id",
    "productId": {
      "_id": "product_id",
      "name": "Product Name",
      "price": 99.99,
      "brand": "Brand Name",
      "category": "Category",
      "image": "image_url"
    },
    "createdAt": "timestamp"
  }
]
```

### Contact & Communication

#### 17. Contact Seller (Protected)
**POST** `/contact-seller`
**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "productId": "product_id",
  "message": "I'm interested in this product..."
}
```

**Response:**
```json
{
  "message": "Message sent successfully"
}
```

#### 18. Get Seller Inquiries (Protected)
**GET** `/seller-inquiries`
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "_id": "contact_id",
    "buyerId": {
      "_id": "buyer_id",
      "username": "buyer_name",
      "email": "buyer@email.com"
    },
    "productId": {
      "_id": "product_id",
      "name": "Product Name",
      "price": 99.99
    },
    "message": "I'm interested in this product...",
    "createdAt": "timestamp"
  }
]
```

### User Profile

#### 19. Get User Profile (Protected)
**GET** `/profile`
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "_id": "user_id",
  "username": "johndoe",
  "email": "john@example.com",
  "stats": {
    "totalProducts": 5,
    "totalViews": 150,
    "totalInquiries": 3
  },
  "createdAt": "timestamp"
}
```

## Database Models

### User Schema
```javascript
{
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}
```

### Product Schema
```javascript
{
  name: { type: String, required: true },
  price: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  views: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

### Wishlist Schema
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  createdAt: { type: Date, default: Date.now }
}
```

### Contact Schema
```javascript
{
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}
```

## Error Responses

**400 Bad Request:**
```json
{
  "error": "Error message"
}
```

**401 Unauthorized:**
```json
{
  "error": "Access token required"
}
```

**403 Forbidden:**
```json
{
  "error": "Unauthorized to perform this action"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**409 Conflict:**
```json
{
  "error": "Resource already exists"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

## Environment Variables

Create a `.env` file in the backend directory:
```
DB_URI=mongodb://localhost:27017/e-comm
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

## Security Features

- **Password Security**: Password hashing with bcryptjs (salt rounds: 10)
- **JWT Authentication**: Secure token-based authentication with expiration
- **Input Validation**: Comprehensive request validation and sanitization
- **User Authorization**: Strict ownership verification for protected operations
- **Error Handling**: Secure error responses without sensitive information exposure
- **CORS Configuration**: Proper cross-origin request handling
- **Middleware Protection**: Route-level authentication and authorization

## Recent API Updates

### New Features
- **Advanced Filtering**: Comprehensive product filtering with pagination
- **Wishlist System**: Complete wishlist management endpoints
- **Contact System**: Seller-buyer communication functionality
- **View Tracking**: Product popularity tracking with view counters
- **Metadata API**: Dynamic filter options for frontend

### Performance Improvements
- **Pagination**: Efficient data loading for large datasets
- **Query Optimization**: Optimized database queries with proper indexing
- **Response Standardization**: Consistent API response formats
- **Error Handling**: Improved error responses and logging

### Bug Fixes
- **View Counter**: Fixed double-increment issues
- **Authentication**: Enhanced token validation and error handling
- **Data Integrity**: Improved validation and constraint handling

## Dependencies

- **express**: Web framework for Node.js
- **mongoose**: MongoDB ODM with schema validation
- **bcryptjs**: Password hashing and verification
- **jsonwebtoken**: JWT authentication and authorization
- **cors**: Cross-origin request handling
- **dotenv**: Environment variable management
- **nodemon**: Development auto-restart utility
