# 🦈 Sharkawy Phones Store - Backend Documentation

## Overview
Full-stack e-commerce backend built with Node.js, Express, and MongoDB. Handles product management, user authentication, shopping cart, orders, and payments.

## Project Structure

```
backend/
├── models/
│   ├── Product.js        # Product schema with validations
│   ├── User.js           # User authentication schema
│   ├── Cart.js           # Shopping cart schema
│   └── Order.js          # Order and transaction schema
├── routes/
│   ├── productRoutes.js  # Product API endpoints
│   ├── userRoutes.js     # Authentication & user profile
│   ├── cartRoutes.js     # Shopping cart operations
│   ├── orderRoutes.js    # Order management
│   └── paymentRoutes.js  # Payment processing
├── middleware/
│   └── auth.js           # JWT authentication & error handling
├── seeds/
│   └── seedDatabase.js   # Initial data seeding
├── server.js             # Express application setup
├── package.json          # Dependencies and scripts
├── .env.example          # Environment variables template
└── .gitignore           # Git ignore file
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Strong secret key for tokens
   - `PORT`: Server port (default: 5000)

3. **Seed Initial Data**
   ```bash
   npm run seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   Or production:
   ```bash
   npm start
   ```

## API Endpoints

### Products
- `GET /api/products` - Get all products (supports filtering, sorting, pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `GET /api/products/featured/items` - Get featured products

### Users (Authentication)
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get current user (protected)
- `PUT /api/users/profile` - Update profile (protected)
- `PUT /api/users/change-password` - Change password (protected)
- `POST /api/users/wishlist/add` - Add to wishlist (protected)
- `DELETE /api/users/wishlist/remove/:productId` - Remove from wishlist (protected)

### Shopping Cart (Protected)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add product to cart
- `PUT /api/cart/update/:productId` - Update quantity
- `DELETE /api/cart/remove/:productId` - Remove from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Orders (Protected)
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:orderId` - Get specific order
- `POST /api/orders/create` - Create new order (checkout)
- `PUT /api/orders/:orderId/status` - Update order status (admin)
- `PUT /api/orders/:orderId/cancel` - Cancel order

### Payments (Protected)
- `POST /api/payments/process` - Process payment
- `GET /api/payments/status/:orderId` - Check payment status
- `POST /api/payments/refund/:orderId` - Refund payment

## Authentication

### JWT Token
- Token obtained from login/register endpoints
- Must be sent in Authorization header: `Bearer <token>`
- Expires after 7 days
- Required for: cart, orders, user profile operations

### Example Request with Auth
```javascript
const response = await fetch('http://localhost:5000/api/cart', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIs...'
  }
});
```

## Models

### Product
```javascript
{
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  category: 'phones' | 'accessories' | 'chargers' | 'cases' | 'earbuds',
  stock: Number,
  rating: Number (0-5),
  reviewCount: Number,
  image: String,
  images: [String],
  brand: String,
  specs: Object,
  featured: Boolean,
  inStock: Boolean,
  timestamps: Date
}
```

### User
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  address: Object,
  role: 'user' | 'admin',
  status: 'active' | 'inactive' | 'banned',
  wishlist: [ProductId],
  orders: [OrderId],
  preferences: Object,
  timestamps: Date
}
```

### Order
```javascript
{
  orderNumber: String (unique),
  userId: UserId,
  items: [{productId, name, price, quantity, image}],
  customerInfo: {firstName, lastName, email, phone},
  shippingAddress: Object,
  billingAddress: Object,
  orderSummary: {subtotal, tax, shippingCost, discount, total},
  paymentDetails: {method, status, transactionId, paidAt},
  shippingDetails: {method, trackingNumber, carrier, estimatedDelivery},
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned',
  timestamps: Date
}
```

### Cart
```javascript
{
  userId: UserId,
  sessionId: String,
  items: [{productId, name, price, quantity, image}],
  totalItems: Number,
  totalPrice: Number,
  appliedCoupon: Object,
  shippingAddress: Object,
  shippingMethod: String,
  timestamps: Date
}
```

## Scripts

### Available NPM Scripts
```bash
npm start          # Run production server
npm run dev        # Run development server with nodemon
npm run seed       # Seed database with initial data
npm test           # Run tests (if configured)
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| MONGODB_URI | Database connection | mongodb://localhost:27017/sharkawy-phones |
| JWT_SECRET | Token secret | your-secret-key |
| CLIENT_URL | Frontend URL for CORS | http://localhost:3000 |

## Frontend Integration

### Update Frontend Scripts
Replace `shopping.js` with `shopping-api.js` to use API:

```html
<!-- Before -->
<script src="shopping.js"></script>

<!-- After -->
<script src="shopping-api.js"></script>
```

### API Configuration in Frontend
Update `API_BASE_URL` in `shopping-api.js` if backend is on different address:
```javascript
const API_BASE_URL = 'http://your-backend-url:5000/api';
```

## Testing

### Test Endpoints with cURL

**Register User:**
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get Products:**
```bash
curl http://localhost:5000/api/products
```

**Add to Cart (with auth):**
```bash
curl -X POST http://localhost:5000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "productId": "64a1b2c3d4e5f6g7h8i9j0k1",
    "quantity": 1
  }'
```

## Error Handling

Standard error response format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Field error details"]
}
```

## Database Cleanup

### Delete all collections
```bash
node -e "
  const mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost:27017/sharkawy-phones');
  mongoose.connection.on('connected', async () => {
    await mongoose.connection.db.dropDatabase();
    console.log('Database cleaned');
    process.exit(0);
  });
"
```

## Deployment

### Prepare for Production
1. Update `.env` with production values
2. Set `NODE_ENV=production`
3. Use production MongoDB URI
4. Generate strong JWT_SECRET
5. Configure real payment processor
6. Setup email service
7. Enable HTTPS

### Deploy to Heroku
```bash
heroku create your-app-name
heroku config:set JWT_SECRET=your-production-secret
git push heroku main
```

## Future Enhancements

- [ ] Stripe payment integration
- [ ] Email notifications (order confirmation, shipping)
- [ ] Product reviews and ratings
- [ ] Advanced search and filtering
- [ ] Order tracking with SMS
- [ ] Inventory management dashboard
- [ ] Analytics and reporting
- [ ] Admin panel
- [ ] Two-factor authentication
- [ ] Coupon/discount management

## Support

For issues or questions, contact: support@sharkawy.com

## License

© 2024 Sharkawy Phones Store. All rights reserved.
