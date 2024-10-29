const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from the database
    res.render('product', { products }); // Pass products to the EJS template
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error'); // Handle errors
  }
};

exports.createProduct = async (req, res) => {
  // Logic to create a new product
  const { name, price, description, image, category } = req.body
  try {
    const product = await Product.create({
      name,
      price,
      description,
      image,
      category
    })
    res.status(200).json({ product })
  } catch (error) {
    console.error(error);
    res.status(500).send('Creation failed')
  }

};
