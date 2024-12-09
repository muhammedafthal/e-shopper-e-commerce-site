const Order = require('../models/order');
const Category = require('../models/category');
const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.listAllOrder = async (req, res) => {
    try {
    
        const categories = await Category.find();

        const filters = {
            paymentMethod: req.query.paymentMethod || '',
            paymentStatus: req.query.paymentStatus || '',
            orderStatus: req.query.orderStatus || '',
            category: req.query.category || ''
        };

        let filter = {};

        if (filters.paymentMethod) {
            filter.paymentMethod = filters.paymentMethod;
        }

        if (filters.paymentStatus) {
            filter.paymentStatus = filters.paymentStatus;
        }

        if (filters.orderStatus) {
            filter.orderStatus = filters.orderStatus;
        }

      
        if (filters.category) {
            const productsInCategory = await Product.find({ category: filters.category }).select('_id');
            const productIds = productsInCategory.map(product => product._id);

            if (productIds.length > 0) {
               
                filter['product.productId'] = { $in: productIds };
            } else {
                
                filter['product.productId'] = { $in: [] };
            }
        }

        const order = await Order.find(filter)
            .populate('user', 'username email') 
            .populate({
                path: 'product.productId', 
                populate: {
                    path: 'category', 
                    select: 'name'
                }
            });

        res.render('listAllOrder', {
            order,
            categories,
            filters 
        });
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.editOrderForm = async (req, res) => {
    const orderId = req.params.id;
    const order = await Order.findById(orderId)
 
    if (!order) {
        return res.status(404).send('Order not found');
    }
    res.render('editOrderForm', { order });
};

exports.editOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const { orderStatus, paymentStatus } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(id, {
            orderStatus,
            paymentStatus,
        }, { new: true });

        if (!updatedOrder) {
            return res.status(404).send('Order not found');
        }

        res.redirect('/api/order');  
    } catch (error) {
        console.log(error);
        res.status(500).json('error editing order!')
    }
};
