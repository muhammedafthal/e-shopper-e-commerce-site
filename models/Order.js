const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'UserDetails', // Match the exact model name
        required: true 
    },
    address: {
        fullName: { type: String, required: true },
        addressLine1: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    product: [{
        productId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'product',  // Assuming your product model is named 'Product'
            required: true 
        },
        name: { 
            type: String, 
            required: true 
        },
        image: { type: String },
        quantity: { 
            type: Number, 
            required: true, 
            min: 1 
        },
        price: { 
            type: Number, 
            required: true 
        }
    }],
    totalCost: { 
        type: Number, 
        required: true 
    },
    paymentMethod: {
        type: String,
        enum: ['Card', 'PayPal', 'Net Banking', 'CashOnDelivery'], 
        required: true
    },
    paymentStatus: { 
        type: String, 
        enum: ['pending', 'paid', 'failed'], 
        default: 'pending' 
    },
    orderStatus: { 
        type: String, 
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], 
        default: 'Pending' 
    },
    orderDate: { 
        type: Date, 
        default: Date.now 
    }    
});

orderSchema.pre('save', function (next) {
    if (this.paymentMethod === 'Card') {
        this.paymentStatus = 'paid';
    } else if (this.paymentMethod === 'CashOnDelivery') {
        this.paymentStatus = 'pending';
    }
    next();
});

module.exports = mongoose.model('order', orderSchema);
