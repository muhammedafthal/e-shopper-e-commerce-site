const Order = require('../models/Order');
const Product = require('../models/Product');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('products');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.productId);
    res.status(204).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
