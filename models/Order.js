const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  total: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  paymentDetails: { type: String },  // Could be used for transaction details
});

module.exports = mongoose.model('Order', orderSchema);
