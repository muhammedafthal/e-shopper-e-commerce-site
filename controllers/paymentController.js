const Order = require('../models/Order');

exports.processPayment = async (req, res) => {
  try {
    const { orderId, paymentInfo } = req.body;

    // Simulating a successful payment
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.isPaid = true;
    order.paymentDetails = paymentInfo;  // Add payment transaction info here
    await order.save();

    res.json({ message: 'Payment successful', order });
  } catch (error) {
    res.status(500).json({ error: 'Payment failed' });
  }
};
