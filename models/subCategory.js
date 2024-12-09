
const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
    name: String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
});

module.exports = mongoose.model('Subcategory', subcategorySchema);
