const express = require('express');
const { getCategories, createCategory, getCategoryProducts } = require('../controllers/categoryController');

const router = express.Router();

router.get('/', getCategories);                   // Get all categories
router.post('/', createCategory);                 // Create a new category
router.get('/:categoryId/products', getCategoryProducts);  // Get products by category

module.exports = router;
