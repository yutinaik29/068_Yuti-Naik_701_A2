const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

// Home page - show categories and all products
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({ parent: null });
        const products = await Product.find().populate('category');
        res.render('user/index', { categories, products });
    } catch (err) {
        console.log(err);
        res.send('Error loading shop');
    }
});

// Show products by child category
router.get('/category/:id', async (req, res) => {
    try {
        const categories = await Category.find({ parent: null });
        const products = await Product.find({ category: req.params.id }).populate('category');
        res.render('user/index', { categories, products });
    } catch (err) {
        console.log(err);
        res.send('Error loading category');
    }
});

// Seed database with sample categories and products
router.get('/seed', async (req, res) => {
    try {
        await Category.deleteMany({});
        await Product.deleteMany({});

        // Sample categories
        const electronics = await Category.create({ name: 'Electronics' });
        const mobiles = await Category.create({ name: 'Mobiles', parent: electronics._id });
        const laptops = await Category.create({ name: 'Laptops', parent: electronics._id });

        const clothing = await Category.create({ name: 'Clothing' });
        const men = await Category.create({ name: 'Men', parent: clothing._id });
        const women = await Category.create({ name: 'Women', parent: clothing._id });

        // Sample products
        await Product.create([
            { name: 'iPhone 15', description: 'Latest Apple iPhone', price: 1200, category: mobiles._id, image: '' },
            { name: 'Dell XPS 13', description: 'Laptop for work', price: 900, category: laptops._id, image: '' },
            { name: 'Men T-Shirt', description: 'Cotton T-Shirt', price: 25, category: men._id, image: '' },
            { name: 'Women Dress', description: 'Evening Dress', price: 60, category: women._id, image: '' }
        ]);

        res.send('Database seeded with sample categories and products!');
    } catch (err) {
        console.log(err);
        res.send('Error seeding database');
    }
});

// Add to cart
router.post('/cart/add/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!req.session.cart) req.session.cart = [];
        // Check if product already in cart
        const index = req.session.cart.findIndex(item => item.product._id.equals(product._id));
        if (index > -1) {
            req.session.cart[index].qty += 1;
        } else {
            req.session.cart.push({ product, qty: 1 });
        }
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.send('Error adding to cart');
    }
});

// View cart
router.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
    res.render('user/cart', { cart });
});

module.exports = router;
