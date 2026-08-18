# 🦈 Sharkawy Phones Store - Complete Setup Guide

## Project Overview
Sharkawy Phones Store is a modern, full-stack e-commerce platform featuring:
- 📱 Professional iPhone and accessories store
- 🛒 Full shopping cart system with persistence
- 🎨 Modern blue/cyan professional design
- 🖼️ Auto-rotating product slider
- 👥 User authentication and management
- 📦 Order management system
- 💳 Payment processing framework
- 🔐 JWT-based security

## Project Structure

```
store/
├── Frontend (Client Files)
│   ├── index.html                  # Homepage with hero slider
│   ├── the best selling.html       # Product showcase
│   ├── accessories.html             # Accessories category
│   ├── contactus.html              # Contact page
│   ├── Returnpolicy.html           # Return policy page
│   ├── style.css                   # Complete styling (2500+ lines)
│   ├── shopping.js                 # Shopping cart (LocalStorage version)
│   ├── shopping-api.js             # Shopping cart (API version)
│   └── images/                     # Product images
│
└── backend/                         # Node.js/Express Backend
    ├── models/
    │   ├── Product.js              # Product schema
    │   ├── User.js                 # User authentication
    │   ├── Cart.js                 # Cart management
    │   └── Order.js                # Order processing
    ├── routes/
    │   ├── productRoutes.js        # Product endpoints
    │   ├── userRoutes.js           # Auth endpoints
    │   ├── cartRoutes.js           # Cart endpoints
    │   ├── orderRoutes.js          # Order endpoints
    │   └── paymentRoutes.js        # Payment endpoints
    ├── middleware/
    │   └── auth.js                 # JWT & error handling
    ├── seeds/
    │   └── seedDatabase.js         # Initial data
    ├── server.js                   # Express app
    ├── package.json                # Dependencies
    ├── .env.example                # Environment template
    ├── .gitignore                  # Git config
    └── README.md                   # Backend docs
```

## Features

### Frontend Features ✨
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Image Slider**: Auto-rotating hero carousel with manual controls
- **Shopping Cart**: Add/remove items, adjust quantities
- **LocalStorage**: Cart persists across sessions
- **Professional Theme**: Blue (#0066ff) and cyan (#00d4ff) color scheme
- **Animations**: Smooth transitions and hover effects
- **Product Pages**: Multiple category pages
- **Mobile Navigation**: Hamburger menu support

### Backend Features ⚙️
- **RESTful API**: Clean endpoint structure
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT-based user authentication
- **Password Security**: Bcrypt hashing
- **Cart Management**: Persistent shopping carts
- **Order Processing**: Complete order lifecycle
- **Payment Framework**: Ready for Stripe integration
- **Admin Features**: Product management endpoints
- **Error Handling**: Comprehensive error responses
- **CORS**: Secure cross-origin requests

## Quick Start Guide

### Prerequisites
- Node.js v14+ 
- MongoDB (local or cloud like MongoDB Atlas)
- npm or yarn
- Modern web browser

### Step 1: Backend Setup

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `backend/.env`:
   ```
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   MONGODB_URI=mongodb://localhost:27017/sharkawy-phones
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   ```

3. **Start MongoDB**
   - Local: `mongod`
   - Or use MongoDB Atlas cloud

4. **Seed Database** (Optional - adds sample data)
   ```bash
   npm run seed
   ```

5. **Start Backend Server**
   ```bash
   npm run dev
   ```
   
   Should see:
   ```
   ╔════════════════════════════════════╗
   ║  🦈 SHARKAWY PHONES STORE 🦈       ║
   ║  Backend Server Running             ║
   ║  Port: 5000                         ║
   ║  Environment: development           ║
   ╚════════════════════════════════════╝
   ```

### Step 2: Frontend Setup

1. **Start Local Server** (in project root)
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Or using Node.js
   npx http-server
   ```

2. **Open in Browser**
   ```
   http://localhost:8000
   ```

3. **Switch to API Version** (Optional)
   
   If you want to use the backend API, update your HTML:
   ```html
   <!-- Change from -->
   <script src="shopping.js"></script>
   
   <!-- To -->
   <script src="shopping-api.js"></script>
   ```

## Testing the System

### 1. Test Frontend Cart (LocalStorage - No Backend Required)
- Open http://localhost:8000
- Click "Add to Cart" on any product
- Verify cart count increases
- Refresh page - cart persists
- Click cart icon to open modal

### 2. Test Backend API (With Node.js)

**Check Health:**
```bash
curl http://localhost:5000/api/health
```

**Get Products:**
```bash
curl http://localhost:5000/api/products
```

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

## Default Admin Credentials (After Seeding)

```
Email: admin@sharkawy.com
Password: admin123456
```

⚠️ **Change these in production!**

## Common Commands

### Backend Commands
```bash
cd backend

npm start              # Production mode
npm run dev           # Development with auto-reload
npm run seed          # Seed database with sample data
```

### Frontend Commands
```bash
# Start simple HTTP server (from project root)
python -m http.server 8000    # Python 3
npx http-server               # Node.js
```

## File Sizes and Performance

| File | Size | Type | Purpose |
|------|------|------|---------|
| style.css | ~2500 lines | Styling | Professional UI design |
| shopping.js | ~350 lines | Vanilla JS | Local cart management |
| shopping-api.js | ~500 lines | Vanilla JS | API-based cart |
| server.js | ~100 lines | Node.js | Express server setup |
| models/Product.js | ~90 lines | Mongoose | Product schema |
| models/User.js | ~85 lines | Mongoose | User schema |

## API Usage Examples

### Add to Cart (Authenticated)
```javascript
const token = 'your-jwt-token-from-login';

fetch('http://localhost:5000/api/cart/add', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    productId: '64a1b2c3d4e5f6g7h8i9j0k1',
    quantity: 1
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### Create Order (Checkout)
```javascript
fetch('http://localhost:5000/api/orders/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    customerInfo: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890'
    },
    shippingAddress: {
      street: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      country: 'USA'
    },
    shippingMethod: 'standard',
    paymentMethod: 'card'
  })
})
.then(res => res.json())
.then(data => console.log('Order created:', data));
```

## Troubleshooting

### MongoDB Connection Issues
```
Error: connect ECONNREFUSED 127.0.0.1:27017

Solution:
1. Make sure MongoDB is running
2. Check connection string in .env
3. Use MongoDB Atlas cloud URI if local isn't working
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000

Solution:
1. Kill process on port 5000: 
   Windows: netstat -ano | findstr :5000 then taskkill /PID <PID>
   Mac/Linux: lsof -i :5000 then kill -9 <PID>
2. Change PORT in .env to 5001, 5002, etc.
```

### CORS Errors
```
Error: Access to XMLHttpRequest blocked by CORS policy

Solution:
1. Ensure CLIENT_URL in backend .env is correct
2. Check that frontend URL matches CORS origin
3. Restart backend server after .env changes
```

### JWT Token Expired
```
Error: invalid or expired token

Solution:
1. Re-login to get a new token
2. Store token in localStorage: localStorage.setItem('auth_token', token)
3. Send token in Authorization header for all protected routes
```

## Next Steps / Enhancements

### Immediate (Ready to implement)
- [ ] Add real Stripe payment processing
- [ ] Setup email notifications (Nodemailer)
- [ ] Create admin dashboard for product management
- [ ] Add product search functionality
- [ ] Implement coupon/discount system

### Medium-term
- [ ] User reviews and ratings
- [ ] Wishlist functionality
- [ ] Order tracking with SMS
- [ ] Product recommendations
- [ ] Advanced inventory management

### Advanced
- [ ] Analytics and reporting dashboard
- [ ] Multi-language support
- [ ] Performance optimization
- [ ] CI/CD pipeline
- [ ] Docker containerization

## Technology Stack

### Frontend
- HTML5
- CSS3 (custom styling, animations)
- Vanilla JavaScript (no frameworks)
- LocalStorage API

### Backend
- Node.js
- Express.js v4
- MongoDB
- Mongoose v7
- JWT Authentication
- Bcryptjs (password hashing)

### Tools & Services
- Git & GitHub
- MongoDB Atlas (optional cloud DB)
- Heroku/Vercel (deployment ready)
- Stripe (payment processing - ready)

## Security Considerations

1. **Never commit .env file** - Use .env.example only
2. **Change JWT_SECRET** in production
3. **Use HTTPS** in production
4. **Validate all inputs** - Use express-validator
5. **Rate limiting** - Add in production
6. **CORS configuration** - Restrict to your domain
7. **Password requirements** - Enforce strong passwords
8. **Admin role verification** - Always check authorization

## Performance Tips

1. **Database Indexing** - Already configured in models
2. **Pagination** - Use limit and page parameters in API calls
3. **Caching** - Consider adding Redis for sessions
4. **Image Optimization** - Compress images before uploading
5. **API Response Limits** - Only return needed fields

## Support & Resources

### API Documentation
See `backend/README.md` for detailed endpoint documentation

### Sample Data
The seeder creates 6 sample products ready to use:
- iPhone 16 Pro
- iPhone 16
- iPhone 17
- iPhone 17 Pro
- Fast Charger
- AirPods Pro

### Development
- Frontend runs on: `http://localhost:8000`
- Backend runs on: `http://localhost:5000`
- API endpoints: `http://localhost:5000/api/*`

## License

© 2024 Sharkawy Phones Store. All rights reserved.

---

**Happy Building! 🚀**

For questions or issues, refer to backend README.md or contact support@sharkawy.com
