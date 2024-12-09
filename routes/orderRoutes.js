const express = require('express');
const router = express.Router();

const {
    listAllOrder,
    editOrderForm,
    editOrder
} = require('../controllers/orderController');

router.get('/', listAllOrder);
router.get('/edit-order/:id', editOrderForm);
router.put('/update-order/:id', editOrder);


module.exports = router;