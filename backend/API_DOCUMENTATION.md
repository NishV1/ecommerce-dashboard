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
    "userId": "user_id",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
]
```

#### 4. Get User's Products (Protected)
**GET** `/my-products`
**Headers:** `Authorization: Bearer <token>`

#### 5. Add New Product (Protected)
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

#### 6. Update Product (Protected)
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

#### 7. Delete Product (Protected)
**DELETE** `/delete-product/:id`
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Product deleted successfully"
}
```

#### 8. Get Single Product
**GET** `/product/:id`

#### 9. Search Products
**GET** `/search/:key`

Search in product name, brand, or category.

### User Profile

#### 10. Get User Profile (Protected)
**GET** `/profile`
**Headers:** `Authorization: Bearer <token>`

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

**404 Not Found:**
```json
{
  "error": "Resource not found"
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

- Password hashing with bcryptjs
- JWT token authentication
- Input validation
- User authorization for product operations
- Error handling

## Dependencies

- express: Web framework
- mongoose: MongoDB ODM
- bcryptjs: Password hashing
- jsonwebtoken: JWT authentication
- cors: Cross-origin requests
- dotenv: Environment variables
- nodemon: Development auto-restart
