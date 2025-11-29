# Missing Backend Endpoint Implementations

Based on a comparison between the frontend application code and the `API_DOCUMENTATION_V2.md`, the following backend endpoints and associated logic need to be implemented or verified.

---

## 1. Order Service (`/api/v1/orders`)

### Create Order

**Endpoint:** `POST /api/v1/orders`

**Issue:** The backend must be able to process the complete `CreateOrderDTO` as specified in the API documentation. The frontend is currently not sending all the required data, but the backend should be prepared for the correct payload.

**Required Backend Logic:**
- The endpoint must accept and process a request body containing:
  - `customerId` (Number)
  - `shippingAddress` (Object)
  - `orderItems` (Array of objects)
- It should perform validation on all incoming fields.

**Example Expected Request Body:**
```json
{
  "customerId": 1,
  "shippingAddress": {
    "fullName": "John Doe",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "orderItems": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 999.99
    }
  ]
}
```

---

### Update Order Status

**Endpoint:** `PATCH /api/v1/orders/{id}/status`

**Issue:** This endpoint appears to be missing. The frontend is incorrectly attempting to use a generic `PUT /api/v1/orders/{id}` request, which is not aligned with the documentation for updating only the status.

**Required Backend Implementation:**
- Create a new endpoint that specifically handles `PATCH` requests to `/api/v1/orders/{id}/status`.
- This endpoint is responsible for the partial update of an order's status.

**Example Expected Request Body:**
```json
{
  "status": "CONFIRMED"
}
```
**Valid Status Values:** `PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`.

---

### Cancel Order

**Endpoint:** `DELETE /api/v1/orders/{id}`

**Issue:** The implementation of this endpoint needs to be verified to ensure it includes crucial side-effects required in a microservice architecture.

**Required Backend Logic Confirmation:**
- When an order is "deleted" (cancelled), the service must perform two critical actions:
  1. Update the order's status to `CANCELLED` in the database.
  2. **Trigger an event or API call to the Product Service** to release the stock reserved for each item in the cancelled order. This involves calling `POST /api/v1/products/{id}/release?quantity={quantity}` for every item.
