# API Documentation

This document outlines all the backend API endpoints that need to be implemented for the e-commerce application.

## Base URL

```
http://localhost:8080/api/v1
```

All endpoints are prefixed with the base URL above.

## Authentication

All authenticated requests must include a Bearer token in the Authorization header:

```
Authorization: Bearer {token}
```

Tokens are automatically managed by the frontend and stored in HTTP-only cookies.

---

## Authentication Endpoints

### POST /auth/login

Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "user"
    }
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "errors": ["Invalid credentials"]
}
```

---

### POST /auth/register

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "user"
    }
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "errors": {
    "email": ["Email already exists"]
  }
}
```

---

### POST /auth/logout

Logout the current user.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### GET /auth/me

Get the currently authenticated user.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "user"
  }
}
```

---

### POST /auth/refresh-token

Refresh the authentication token.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## Product Endpoints

### GET /products/

Get all products (with optional pagination).

**Query Parameters:**
- `paginated` (boolean, default: true) - Whether to return paginated results
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Items per page
- `search` (string, optional) - Search query
- `admin` (boolean, default: false) - Include admin-only fields

**Response (200 OK) - Paginated:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Wireless Bluetooth Headphones",
      "description": "Premium noise-cancelling headphones",
      "price": 199.99,
      "category": "Electronics",
      "image": "/images/headphones.jpg",
      "stock": 45,
      "rating": 4.5
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

**Response (200 OK) - Non-paginated:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Wireless Bluetooth Headphones",
      "description": "Premium noise-cancelling headphones",
      "price": 199.99,
      "category": "Electronics",
      "image": "/images/headphones.jpg",
      "stock": 45,
      "rating": 4.5
    }
  ]
}
```

---

### GET /products/{id}/

Get a single product by ID.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Wireless Bluetooth Headphones",
    "description": "Premium noise-cancelling headphones",
    "price": 199.99,
    "category": "Electronics",
    "image": "/images/headphones.jpg",
    "stock": 45,
    "rating": 4.5,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "errors": ["Product not found"]
}
```

---

### POST /products/

Create a new product (Admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Wireless Bluetooth Headphones",
  "description": "Premium noise-cancelling headphones",
  "price": 199.99,
  "category": "Electronics",
  "image": "/images/headphones.jpg",
  "stock": 45,
  "rating": 4.5
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Wireless Bluetooth Headphones",
    "description": "Premium noise-cancelling headphones",
    "price": 199.99,
    "category": "Electronics",
    "image": "/images/headphones.jpg",
    "stock": 45,
    "rating": 4.5,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### PUT /products/{id}/

Update an existing product (Admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "price": 249.99,
  "stock": 30
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Updated Product Name",
    "description": "Premium noise-cancelling headphones",
    "price": 249.99,
    "category": "Electronics",
    "image": "/images/headphones.jpg",
    "stock": 30,
    "rating": 4.5,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-02T00:00:00Z"
  }
}
```

---

### DELETE /products/{id}/

Delete a product (Admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (204 No Content)**

---

## Cart Endpoints

### GET /cart/current/

Get the current user's cart.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "cart-1",
    "userId": "1",
    "items": [
      {
        "product": {
          "id": "1",
          "name": "Wireless Bluetooth Headphones",
          "description": "Premium noise-cancelling headphones",
          "price": 199.99,
          "category": "Electronics",
          "image": "/images/headphones.jpg",
          "stock": 45,
          "rating": 4.5
        },
        "quantity": 2
      }
    ],
    "total": 399.98,
    "itemCount": 2,
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### POST /cart/add/

Add an item to the cart.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "productId": "1",
  "quantity": 2
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "cart-1",
    "userId": "1",
    "items": [...],
    "total": 399.98,
    "itemCount": 2,
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### POST /cart/update/

Update cart item quantity.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "productId": "1",
  "quantity": 3
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "cart-1",
    "userId": "1",
    "items": [...],
    "total": 599.97,
    "itemCount": 3,
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### DELETE /cart/items/{productId}/

Remove an item from the cart.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "cart-1",
    "userId": "1",
    "items": [],
    "total": 0,
    "itemCount": 0,
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### DELETE /cart/clear/

Clear all items from the cart.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "cart-1",
    "userId": "1",
    "items": [],
    "total": 0,
    "itemCount": 0,
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## Order Endpoints

### GET /orders/

Get all orders for the current user.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `paginated` (boolean, default: true)
- `page` (number, default: 1)
- `limit` (number, default: 10)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "ORD-1234567890",
      "userId": "1",
      "items": [
        {
          "product": {
            "id": "1",
            "name": "Wireless Bluetooth Headphones",
            "price": 199.99,
            "image": "/images/headphones.jpg"
          },
          "quantity": 2
        }
      ],
      "total": 399.98,
      "status": "pending",
      "shippingAddress": {
        "fullName": "John Doe",
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA"
      },
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### GET /orders/{id}/

Get a single order by ID.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "ORD-1234567890",
    "userId": "1",
    "items": [...],
    "total": 399.98,
    "status": "pending",
    "shippingAddress": {...},
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### POST /orders/

Create a new order (place order).

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "shippingAddress": {
    "fullName": "John Doe",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "ORD-1234567890",
    "userId": "1",
    "items": [...],
    "total": 399.98,
    "status": "pending",
    "shippingAddress": {...},
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### PUT /orders/{id}/

Update an order (Admin only - typically for status updates).

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "status": "shipped"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "ORD-1234567890",
    "userId": "1",
    "items": [...],
    "total": 399.98,
    "status": "shipped",
    "shippingAddress": {...},
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-02T00:00:00Z"
  }
}
```

---

### GET /orders/user/{userId}/

Get all orders for a specific user (Admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [...]
}
```

---

## User Endpoints

### GET /users/

Get all users (Admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `paginated` (boolean, default: true)
- `page` (number, default: 1)
- `limit` (number, default: 10)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### GET /users/{id}/

Get a single user by ID (Admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### PUT /users/{id}/

Update a user (Admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Jane Doe",
  "role": "admin"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Jane Doe",
    "email": "user@example.com",
    "role": "admin",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-02T00:00:00Z"
  }
}
```

---

### DELETE /users/{id}/

Delete a user (Admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (204 No Content)**

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "errors": {
    "field_name": ["Error message"]
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "errors": ["Unauthorized"]
}
```

### 403 Forbidden
```json
{
  "success": false,
  "errors": ["Forbidden - Admin access required"]
}
```

### 404 Not Found
```json
{
  "success": false,
  "errors": ["Resource not found"]
}
```

### 422 Unprocessable Entity
```json
{
  "success": false,
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "errors": ["Internal server error"]
}
```

---

## Notes

1. **Authentication**: All endpoints except `/auth/login` and `/auth/register` require authentication.
2. **Admin Endpoints**: Endpoints marked as "Admin only" require the user to have the `admin` role.
3. **Pagination**: When `paginated=false`, the response will not include the `meta` field.
4. **Timestamps**: All timestamps are in ISO 8601 format (UTC).
5. **IDs**: All IDs are strings for flexibility.
6. **Status Values**: Order status can be: `pending`, `processing`, `shipped`, `delivered`, or `cancelled`.
7. **User Roles**: User roles can be: `user` or `admin`.
