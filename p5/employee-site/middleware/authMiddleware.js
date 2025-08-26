const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

const protect = async (req, res, next) => {
    let token;
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) return res.redirect('/login');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.employee = await Employee.findById(decoded.id);
        next();
    } catch (error) {
        return res.redirect('/login');
    }
};

module.exports = { protect };
