
const Category = require('../models/category');
const subCategory = require('../models/subCategory');
const Product = require('../models/Product');
const Cart = require('../models/cart');
const Order = require('../models/order');
const Wishlist = require('../models/whishlist');
const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.adminPage = async (req, res) => {
    const userEmail = req.userEmail
    if (userEmail === "afthal@email.com") {
        res.render('adminDashboard');
    } else {
        res.redirect('/start')
        // res.status(404).json("Only Admin Can Access This PAge.!");
        
    }
};

exports.homePage = async (req, res) => {
    const userEmail = req.userEmail
    
        try {
            const cartCount = req.query.cartCount || 0;
            const username = req.userAvailable?.username || "Guest"
            const categories = await Category.find().populate('subcategories');
            res.render('index', { categories, username, cartCount });
        } catch (error) {
            console.error("Error loading categories:", error);
            res.status(500).send("Internal Server Error");
        }       
};

exports.listAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('listAllProducts', { products });
    } catch (error) {
        console.error("Error loading all products")
    }
}

exports.getProductDetails = async (req, res) => {
    const userId = req.userId;

    try {
        const { productId } = req.query;

        const product = await Product.findById(productId)
            .populate('category', 'name')
            .populate('subcategory', 'name')
            .populate({
                path: 'reviews.userId',
                select: 'username email',
            });

        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.render('productDetails', { product });
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.submitReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { comment } = req.body;
        const userId = req.userId; // Get the user ID from the session or token

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Check if the user has already submitted a review for this product
        const existingReview = product.reviews.find(review => review.userId.toString() === userId.toString());
        if (existingReview) {
            return res.status(400).send('You have already submitted a review for this product');
        }

        // Add the new review to the product's reviews array
        product.reviews.push({ userId, comment });

        // Save the product with the new review
        await product.save();

        console.log(product.reviews); // Check the populated reviews data

        // Redirect to the product details page with the updated reviews
        res.redirect(`/start/viewProductDetails?productId=${productId}`);
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.listOrders = async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await Order.find({ user: userId }).populate('product.productId');
        if (!orders || orders.length === 0) {
            return res.render('listOrder', { orders: [], message: 'No orders found!' });
        }
        res.render('listOrder', { orders, message: null });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.cancelOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findByIdAndUpdate(
            id,
            {
                orderStatus: 'Cancelled',
                paymentStatus: 'failed',
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        console.log(order);

        res.redirect('/start/view/order');
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ message: 'An error occurred while cancelling the order.' });
    }
};

exports.ShowProductsWithId = async (req, res) => {
    try {
        const { id } = req.params;

        const products = await Product.find({ subcategory: id }).populate('subcategory');

        res.render('userProducts', { products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Internal Server Error");
    }
};

exports.cartDetails = async (req, res) => {
    try {
        const userId = req.userId;
        const cart = await Cart.findOne({ userId }).populate('product.productId');

        const validProducts = cart ? cart.product.filter(item => item.productId) : [];
        const cartCount = validProducts.reduce((sum, item) => sum + item.validProducts, 0);  // Count total items in cart

        res.render('cartDetails', { products: validProducts, cartCount });
    } catch (error) {
        console.error("Error loading cart:", error);
        res.status(500).send("Internal Server Error");
    }
};

exports.AddCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.query;
        const userId = req.userId;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).send("Invalid productId");
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                product: [{ productId, quantity }]
            });
        } else {
            const existingProductIndex = cart.product.findIndex(item =>
                item.productId.equals(productId)
            );

            if (existingProductIndex >= 0) {
                cart.product[existingProductIndex].quantity += parseInt(quantity, 10);
            } else {
                cart.product.push({ productId, quantity });
            }
        }

        await cart.save();

        // After adding to cart, get the updated count of items in the cart
        const cartCount = cart.product.reduce((sum, item) => sum + item.quantity, 0);

        res.status(200).redirect(`/start?cartCount=${cartCount}`);  // Pass cart count in the redirect URL
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).send("Internal Server Error");
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        await Cart.updateOne(
            { userId },
            { $pull: { product: { productId: id } } }
        );

        const cart = await Cart.findOne({ userId }).populate('product.productId');

        const validProducts = cart ? cart.product.filter(item => item.productId) : [];

        res.render('cartDetails', { products: validProducts });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).send("Failed to delete item from cart");
    }
};

exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.query;
        const userId = req.userId;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send("Product not found");
        }

        let wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            wishlist = new Wishlist({ userId, product: [productId] });
        } else {
            if (!wishlist.product.includes(productId)) {
                wishlist.product.push(productId);
            }
        }

        await wishlist.save();

        res.redirect('/start');
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        res.status(500).send("Internal Server Error");
    }
};

exports.viewWishlist = async (req, res) => {
    try {
        const userId = req.userId;

        const wishlist = await Wishlist.findOne({ userId }).populate('product');

        res.render('whishlistPage', { products: wishlist ? wishlist.product : [] });
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).send("Internal Server Error");
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        await Wishlist.updateOne(
            { userId },
            { $pull: { product: id } }
        );

        const wishlist = await Wishlist.findOne({ userId }).populate('product');

        res.render('whishlistPage', { products: wishlist ? wishlist.product : [] });
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        res.status(500).send("Internal Server Error");
    }
};

exports.decreaseQuantity = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    try {
        await Cart.updateOne(
            { userId, "product.productId": id, "product.quantity": { $gt: 1 } },
            { $inc: { "product.$.quantity": -1 } }
        );

        res.redirect('/start/cart');
    } catch (error) {
        console.error("Error decreasing quantity:", error);
        res.status(500).send("Failed to decrease quantity.");
    }
}

exports.increaseQuantity = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    try {
        // Ensure the quantity doesn't exceed stock
        const cartItem = await Cart.findOne({ userId, "product.productId": id }).populate('product.productId');
        const product = cartItem.product.find(item => item.productId._id.toString() === id);

        if (product && product.quantity < product.productId.stock) {
            await Cart.updateOne(
                { userId, "product.productId": id },
                { $inc: { "product.$.quantity": 1 } }
            );
        }

        res.redirect('/start/cart');
    } catch (error) {
        console.error("Error increasing quantity:", error);
        res.status(500).send("Failed to increase quantity.");
    }
}

exports.individualAddressForm = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    res.status(200).render('individualAddressForm', { product })
}

exports.individualCheckout = async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;

    try {
        const { fullName, addressLine1, city, state, postalCode, country, paymentMethod } = req.body;
        const address = { fullName, addressLine1, city, state, postalCode, country };

        const product = await Product.findById(id)
            .populate('category', 'name')
            .populate('subcategory', 'name');

        const order = new Order({
            user: userId,
            address,
            product: [{
                productId: product._id,
                name: product.name,
                image: product.image,
                quantity: 1,
                price: product.price
            }],
            totalCost: product.price,
            paymentMethod,
            paymentStatus: "pending",
            orderStatus: 'Pending'
        });

        await order.save();

        if (paymentMethod == "CashOnDelivery") {
            res.status(200).json("Your Payment Has Completed.")
        } else {
            res.redirect('/start/payment');
        }

    } catch (error) {
        console.error('Error during checkout:', error.message);
        console.error(error.stack);
        res.status(500).send('An error occurred during checkout.');
    }
}

exports.paymentAddress = async (req, res) => {
    res.status(200).render('addressForm');
}

exports.checkoutHandler = async (req, res) => {
    const userId = req.userId;

    try {
        const { fullName, addressLine1, city, state, postalCode, country, paymentMethod } = req.body;
        const address = { fullName, addressLine1, city, state, postalCode, country };

        const cart = await Cart.findOne({ userId }).populate('product.productId');
        if (!cart || cart.product.length === 0) {
            return res.status(400).send('Your cart is empty.');
        }

        // Calculate total cost
        const totalCost = cart.product.reduce(
            (sum, item) => sum + item.productId.price * item.quantity,
            0
        );

        const order = new Order({
            user: userId,
            address,
            product: cart.product.map(item => ({
                productId: item.productId._id,
                name: item.productId.name,
                image: item.productId.image,
                quantity: item.quantity,
                price: item.productId.price
            })),
            totalCost,
            paymentMethod,
            paymentStatus: "pending",
            orderStatus: 'Pending'
        });

        await order.save();

        await Cart.findOneAndUpdate({ userId }, { $set: { product: [] } });

        if (paymentMethod == "CashOnDelivery") {
            res.status(200).json("Your Payment Has Been Completed.")
        } else {
            res.redirect('/start/payment');
        }

    } catch (error) {
        console.error('Error during checkout:', error.message);
        console.error(error.stack);
        res.status(500).send('An error occurred during checkout.');
    }
};


exports.paymentPage = async (req, res) => {
    const userId = req.userId;

    try {
        const order = await Order.findOne({ user: userId })
            .populate('product.productId')
            .sort({ orderDate: -1 })
        if (!order) {
            console.log('No recent order found.');
            return res.render('paymentPage', { order: null });
        }

        res.render('paymentPage', { order });
    } catch (error) {
        console.error('Error fetching payment page:', error);
        res.status(500).send('An error occurred.');
    }
};

exports.paymentGateway = async (req, res) => {
    const userId = req.userId;

    try {
        const order = await Order.findOne({ user: userId })
            .populate('product.productId')
            .sort({ orderDate: -1 });

        if (!order) {
            return res.status(404).json({ error: 'No recent orders found.' });
        }


        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: order.product.map((item) => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.productId.name,
                        images: [`${process.env.BASE_URL}${item.productId.image}`],
                    },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: `${process.env.BASE_URL}/start/success?session_id={CHECKOUT_SESSION_ID}`, // Redirect on success
            //success_url: `${process.env.BASE_URL}/start/success?session_id={CHECKOUT_SESSION_ID}$sessionId=${sessionId}`, // Redirect on success

            cancel_url: `${process.env.BASE_URL}/start/cancel`, // Redirect on cancel
            metadata: {
                orderId: order._id.toString(),
            },
        });


        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating Stripe Checkout Session:', error);
        res.status(500).json({ error: 'Failed to create checkout session.' });
    }
};

exports.paymentSuccess = async (req, res) => {
    res.render('paymentSuccess', { message: 'Payment completed successfully!' });
}

exports.paymentFail = async (req, res) => {
    res.render('paymentFail', { message: 'Payment failed. Please try again later!' });
}











