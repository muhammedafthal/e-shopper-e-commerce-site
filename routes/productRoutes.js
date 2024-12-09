const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'public/images' });

const {
    getAllProducts,
    createForm,
    createProduct,
    editProductForm,
    viewProductDetails,
    deleteReview,
    updateProduct,
    deleteProduct,
    blockProduct,
    updateProductForm,

    profitGraph
} = require('../controllers/productController');

router.get('/', getAllProducts); // To Get All Products Which Exist.
router.get('/addProduct', createForm); // To Get A Form To Add New Products.
router.get('/editproduct', editProductForm); // To Get A Form Which We Can Edit, Delete Or Block/Unblock Of Exist Products.
router.get('/view/productDetails/:id', viewProductDetails)
router.post('/delete-reviews/:reviewId', deleteReview);
router.get('/updateProductForm/:id', updateProductForm); // To Get A Form Where We Can Update The Product With ID In The Url.
router.post('/', upload.single('image'), createProduct); // To Add New Products.
router.put('/:id', editProductForm); // To Edit Product With ID.
router.post('/update/:id', upload.single('image'), updateProduct); // To Update Exist Products With ID.
router.put('/block/:id', blockProduct); // To Block/Unblock Product With ID.
router.delete('/delete/:id', deleteProduct); // To Delete Product With ID.

//PROFIT-GRAPH
router.get('/profit-graph', profitGraph);

module.exports = router;
