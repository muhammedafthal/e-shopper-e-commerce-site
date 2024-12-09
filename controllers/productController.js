const Product = require('../models/Product');
const Category = require('../models/category');
const subCategory = require('../models/subCategory');
const Order = require('../models/order');


exports.getAllProducts = async (req, res) => {
  try {
    const { category } = req.body
    const products = await Product.find({ isBlocked: false });
    const categories = await Category.findOne({ name: category });
    res.render('product', { products, categories });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.createForm = async (req, res) => {
  try {
    const categories = await Category.find().populate('subcategories'); // Populate subcategories
    const subcategories = await subCategory.find()
    res.render('addProduct', { categories, subcategories });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to load categories');
  }
};

exports.createProduct = async (req, res) => {
  const { name, price, description, category, subcategory, stock } = req.body;
  const image = req.file ? `/images/${req.file.filename}` : null;

  try {
    const product = await Product.create({
      name,
      price,
      description,
      category,
      subcategory,
      image,
      stock: parseInt(stock, 10) // Parse stock as an integer
    });

    console.log(product);
    res.render('adminDashboard', { message: 'Product created successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Creation failed');
  }
};


exports.editProductForm = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('editproduct', { products });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
exports.viewProductDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id)
      .populate('category', 'name') 
      .populate('subcategory', 'name')
      .populate({
        path: 'reviews.userId',
        select: 'username email',
      }); 

    if (!product) {
      return res.status(404).send("Product not found");
    }

    res.render('viewProductDetails', { product });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
};

exports.deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
 
    const product = await Product.findOneAndUpdate(
      { 'reviews._id': reviewId },
      { $pull: { reviews: { _id: reviewId } } },
      { new: true }
    );

    if (!product) {
      return res.status(404).send('Product or review not found');
    }

    res.redirect(`/api/products/view/productDetails/${product._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.updateProductForm = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const categories = await Category.find()
    const subcategories = await subCategory.find();
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.render('updateProduct', { product, categories, subcategories });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading product for editing');
  }
};

exports.updateProduct = async (req, res) => {
  const { name, price, description, category, subcategory, stock } = req.body;
  const image = req.file ? `/images/${req.file.filename}` : null;

  if (!(name && price && description && category && subcategory && stock)) {
    return res.status(400).json({ error: 'All fields are mandatory!' });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        description,
        category,
        subcategory,
        stock: parseInt(stock, 10), // Update stock
        ...(image && { image }) // Include image if provided
      },
      { new: true }
    );

    console.log("Updated Product: ", updatedProduct);
    res.redirect('/start');
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send('Failed to update product');
  }
};


exports.blockProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    product.isBlocked = !product.isBlocked
    await product.save();
    res.redirect('/start');
  } catch (error) {
    console.error("Failed to block product:", error);
    res.status(500).send("Failed to block product");
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    const products = await Product.find();
    res.render('editproduct', { products });
  } catch (error) {
    console.log(error);
    res.status(500).send('failed to delete product')
  }
};

exports.profitGraph = async (req, res) => {

  try {

    const profitData = await Order.aggregate([
      {
        $match: { orderStatus: 'Delivered' } 
      },
      {
        $unwind: "$product"
      },
      {
        $group: {
          _id: {
            year: { $year: "$orderDate" },
            month: { $month: "$orderDate" }
          },
          totalProfit: { $sum: "$totalCost" } 
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 } 
      }
    ]);
   
    const topSellingProducts = await Order.aggregate([
      {
        $match: { orderStatus: 'Delivered' } 
      },
      {
        $unwind: "$product" 
      },
      {
        $group: {
          _id: "$product.productId", 
          name: { $first: "$product.name" }, 
          image: { $first: "$product.image" }, 
          totalQuantity: { $sum: "$product.quantity" }
        }
      },
      {
        $sort: { totalQuantity: -1 } 
      },
      {
        $limit: 5 
      }
    ]);

    const formattedData = profitData.map(data => ({
      month: data._id.month,
      year: data._id.year,
      profit: data.totalProfit
    }));

    console.log(formattedData); 
    console.log(topSellingProducts); 

    res.render('profitGraph', { profitData: formattedData, topSellingProducts });

  } catch (error) {
    console.error("Error fetching profit data:", error);
    res.status(500).send("Internal Server Error");
  }
};




