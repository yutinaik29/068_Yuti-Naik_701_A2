const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/Product');

// Admin dashboard
router.get('/', (req, res) => {
    res.render('admin/dashboard');
});

// Manage Categories
router.get('/categories', async (req, res) => {
    const categories = await Category.find();
    res.render('admin/categories', { categories });
});

router.post('/categories', async (req, res) => {
    await Category.create({ name: req.body.name, parent: req.body.parent || null });
    res.redirect('/admin/categories');
});

// Manage Products
router.get('/products', async (req, res) => {
    const products = await Product.find().populate('category');
    const categories = await Category.find();
    res.render('admin/products', { products, categories });
});

router.post('/products', async (req, res) => {
    await Product.create({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: req.body.image
    });
    res.redirect('/admin/products');
});

module.exports = router;
