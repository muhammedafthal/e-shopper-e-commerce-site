
const express = require('express');
const router = express.Router();

const {
    addForm,
    createCategory,
    getAllCategories,
    editCategoryForm,
    editCategory,
    deleteCategory
} = require('../controllers/categoryController');

router.get('/', getAllCategories); // To Get All Categories.
router.get('/addForm', addForm); // To Get All Categories.
router.post('/add', createCategory); // Add New Category
router.get('/edit/:id', editCategoryForm); // To Get Form For Edit Exist Category.
router.post('/:id', editCategory); // To Edit Exist Category.
router.delete('/delete/:id', deleteCategory); // To Delete Exist Category.

module.exports = router;
