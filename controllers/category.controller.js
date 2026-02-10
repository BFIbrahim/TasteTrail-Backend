const Category = require("../models/Category.model");

exports.addCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name || !image) {
      return res.status(400).json({ message: "Name and image are required" });
    }

    const newCategory = await Category.create({ name, image });
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};