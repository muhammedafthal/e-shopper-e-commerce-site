const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' }],  // References to Subcategory model
});

module.exports = mongoose.model('Category', categorySchema);
