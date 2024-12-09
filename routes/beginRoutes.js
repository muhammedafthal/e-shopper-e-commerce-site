const express = require('express');
const route = express.Router();

const {
    adminPage,

    homePage,
    listAllProducts,
    getProductDetails,
    submitReview,
    listOrders,
    cancelOrder,
    ShowProductsWithId,

    AddCart,
    cartDetails,
    deleteItem,

    addToWishlist,
    viewWishlist,
    removeFromWishlist,

    decreaseQuantity,
    increaseQuantity,

    individualAddressForm,
    individualCheckout,

    paymentAddress,
    checkoutHandler,
    paymentPage,

    paymentGateway,

    paymentSuccess,
    paymentFail
} = require('../controllers/beginController');

const { authenticateUser } = require('../middleware/authenticateUser');
const { authenticateToken } = require('../middleware/authenticateToken'); // MIDDLEWARE TO AUTHENTICATE

route.get('/admin', authenticateToken, adminPage); // To Get Admin-Dashboard.

//HOME-PAGE-WITH-CATEGORY/SUBCATEGORY, LIST-ALL-PRODUCTS, REVIEW-SUBMISSION, CANCEL-ORDER 
route.get('/', authenticateToken, homePage); // To Show Home Page Of The Application.
route.get('/allProducts', listAllProducts); // To List All Products.
route.get('/viewProductDetails', authenticateUser, getProductDetails); // To View Product Details Individually.
route.post('/viewProductDetails/:productId/reviews', authenticateUser, submitReview);
route.get('/view/order', authenticateUser, listOrders); // LIST ALL ORDER
route.put('/cancel/order/:id', cancelOrder); //TO CANCEL ANY OF OUR ORDER
route.get('/products/:id', ShowProductsWithId); // To Show Products Based On Selected SubCategory Using ID.  

// CART
route.get('/addCart', authenticateUser, AddCart); //To Add Product To Cart.
route.get('/cart', authenticateUser, cartDetails); // To See Which Are The Products We Added To The Cart.
route.delete('/cart/remove-item/:id', authenticateUser, deleteItem); // To Delete The Products Which Are In The Cart.

// WISHLIST
route.get('/wishlist/add', authenticateUser, addToWishlist); // Add item to Wishlist.
route.get('/wishlist', authenticateUser, viewWishlist); // View Wishlist.
route.post('/wishlist/remove-item/:id', authenticateUser, removeFromWishlist); // REMOVE ITEMS FROM WISHLIST

// INCREAMENT/DECREAMENT-QUANTITY
route.put('/cart/decrease-quantity/:id', authenticateUser, decreaseQuantity); // To Decrease The Quantity Of That Product.
route.put('/cart/increase-quantity/:id', authenticateUser, increaseQuantity); // To Increase The Quantity Of That Product.

//INDIVIDUAL PAYMENT_PAGE/FORM/CHECKOUT_HANDLER FOR EACH PRODUCT.
route.get('/individual/addressForm/:id', authenticateUser, individualAddressForm);
route.post('/individual/checkout/:id', authenticateUser, individualCheckout);

//PAYMENT_PAGE/FORM/CHECKOUT_HANDLER
route.get('/addressForm', authenticateUser, paymentAddress);
route.post('/checkout', authenticateUser, checkoutHandler);
route.get('/payment', authenticateUser, paymentPage);

//PAYMENT_GATEWAY
route.get('/pay', authenticateUser, paymentGateway); // PAYMENT-GATEWAY(STRIPE)

// Success page
route.get('/success', paymentSuccess);
// Cancel page
route.get('/cancel', paymentFail);




module.exports = route;