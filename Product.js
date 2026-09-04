// Product Model
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price must be non-negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price must be non-negative']
  },
  category: {
    type: String,
    enum: ['phones', 'accessories', 'chargers', 'cases', 'earbuds'],
    required: [true, 'Please select a category']
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    required: [true, 'Please provide a product image URL']
  },
  images: [String],
  brand: {
    type: String,
    required: [true, 'Please specify the brand']
  },
  specs: {
    processor: String,
    ram: String,
    storage: String,
    display: String,
    battery: String,
    camera: String
  },
  inStock: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create index for search
productSchema.index({ name: 'text', description: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);
