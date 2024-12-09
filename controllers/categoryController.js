
const Product = require('../models/Product');
const Category = require('../models/category');
const subCategory = require('../models/subCategory');

exports.addForm = async (req, res) => {
  res.render('addCategory');
}

exports.createCategory = async (req, res) => {
  const { name, description, subcategories } = req.body;

  try {
    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).send('Category already exists');
    }
    // Create Subcategory documents and get their ObjectIds
    const subcategoryIds = [];
    for (let subcategoryName of subcategories) {
      const subcategory = new subCategory({ name: subcategoryName });
      await subcategory.save();  // Save each subcategory
      subcategoryIds.push(subcategory._id);  // Store the ObjectId
    }
    // Create new category with subcategories
    const newCategory = await Category.create({
      name,
      description,
      subcategories: subcategoryIds,  // Store the references to subcategory ObjectIds
    });
    console.log(subcategories);
    res.redirect('/start');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating category');
  }
};

exports.getAllCategories = async (req, res) => {

  try {
    const categories = await Category.find().populate('subcategories');
    res.render('categoryList', { categories });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching categories');
  }
};

// exports.editCategoryForm = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const category = await Category.findById(id)
//     const subCategory = await subCategory.find();
//     res.render('editCategory', { category, subCategory })
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error');
//   }
// };

exports.editCategoryForm = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id).populate('subcategories'); // Populates the subcategories
    res.render('editCategory', { category });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading category details');
  }
};

exports.editCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description, subcategories } = req.body;

  try {
    // Check if subcategories is an array and transform it if necessary
    const subcategoryDataArray = Array.isArray(subcategories)
      ? subcategories
      : Object.values(subcategories);

    const updatedSubcategoryIds = [];

    for (let subcategoryData of subcategoryDataArray) {
      const { id: subcategoryId, name: newSubcategoryName } = subcategoryData;

      if (!newSubcategoryName) {
        throw new Error("Each subcategory must have a name.");
      }

      let existingSubcategory;
      if (subcategoryId) {
        existingSubcategory = await subCategory.findById(subcategoryId);
      }

      if (existingSubcategory) {
        if (existingSubcategory.name !== newSubcategoryName) {
          existingSubcategory.name = newSubcategoryName;
          await existingSubcategory.save();
        }
        updatedSubcategoryIds.push(existingSubcategory._id);
      } else {
        const newSubcategory = new subCategory({ name: newSubcategoryName });
        await newSubcategory.save();
        updatedSubcategoryIds.push(newSubcategory._id);
      }
    }

    // Update the category with the list of updated subcategory IDs
    const category = await Category.findById(id);
    category.name = name;
    category.description = description;
    category.subcategories = updatedSubcategoryIds;

    await category.save();

    res.redirect('/api/category');
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).send('Error updating category');
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the category and populate its subcategories
    const category = await Category.findById(id).populate('subcategories');

    if (!category) {
      return res.status(404).send('Category not found');
    }

    // Delete all associated subcategories
    const subcategoryIds = category.subcategories.map(subcat => subcat._id);
    await subCategory.deleteMany({ _id: { $in: subcategoryIds } });

    // Delete the category itself
    await Category.findByIdAndDelete(id);

    res.redirect('/api/category');
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).send('Error deleting category');
  }
};
