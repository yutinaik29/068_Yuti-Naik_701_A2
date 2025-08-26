const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Login page
router.get('/login', (req, res) => res.render('login'));

// Login POST
router.post('/login', async (req, res) => {
    const { empId, password } = req.body;
    const employee = await Employee.findOne({ empId });
    if(employee && await employee.matchPassword(password)){
        const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/profile');
    } else {
        res.send('Invalid credentials');
    }
});

// Logout
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

module.exports = router;
