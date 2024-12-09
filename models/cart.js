
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'UserDetails' 
    },
    product: [{
        productId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'product' 
        },
        quantity: { 
            type: Number, 
            required: true, 
            default: 1, 
            min: 1 // Ensure quantity is at least 1
        }
    }]
});

module.exports = mongoose.model('Cart', cartSchema);
