const express = require('express');
const { getAllOrders, addProduct, deleteProduct } = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/orders', verifyAdmin, getAllOrders);         // Admin view of all orders
router.post('/products', verifyAdmin, addProduct);        // Add new product
router.delete('/products/:productId', verifyAdmin, deleteProduct); // Delete product

module.exports = router;
