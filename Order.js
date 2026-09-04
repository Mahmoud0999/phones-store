// Order Model
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  customerInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  billingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  orderSummary: {
    subtotal: Number,
    tax: Number,
    shippingCost: Number,
    discount: Number,
    total: Number
  },
  paymentDetails: {
    method: {
      type: String,
      enum: ['card', 'paypal', 'bank_transfer'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date,
    paymentProof: String
  },
  shippingDetails: {
    method: {
      type: String,
      enum: ['standard', 'express', 'overnight'],
      default: 'standard'
    },
    trackingNumber: String,
    carrier: String,
    shippedAt: Date,
    estimatedDelivery: Date,
    deliveredAt: Date
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending',
    index: true
  },
  statusTimeline: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  notes: String,
  couponApplied: {
    code: String,
    discount: Number
  },
  review: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    reviewedAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    const timestamp = Date.now().toString().slice(-6);
    this.orderNumber = `SHK-${timestamp}-${count + 1}`;
    
    if (!this.statusTimeline || this.statusTimeline.length === 0) {
      this.statusTimeline = [{
        status: this.orderStatus,
        timestamp: new Date(),
        notes: 'Order created'
      }];
    }
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
