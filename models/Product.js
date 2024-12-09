
const mongoose = require('mongoose');
const { trim } = require('validator');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // Reference to Category
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' }, // Reference to Subcategory
  image: { type: String },
  stock: { type: Number, required: true, default: 0 }, // New field for stock
  isBlocked: { type: Boolean, default: false },
  reviews : [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserDetails',
      required: true
    },
    comment: {
      type: String, trim: true
    },
    rating: { type: Number, min: 1, max: 5}
  }]
});

module.exports = mongoose.model('product', productSchema);

