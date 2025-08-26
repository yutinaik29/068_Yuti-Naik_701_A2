const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');
const { protect } = require('../middleware/authMiddleware');

// Employee profile
router.get('/profile', protect, async (req, res) => {
    res.render('profile', { employee: req.employee });
});

// Leave application page
router.get('/leave', protect, async (req, res) => {
    const leaves = await Leave.find({ employee: req.employee._id });
    res.render('leave', { leaves });
});

// Submit leave
router.post('/leave', protect, async (req, res) => {
    const { date, reason } = req.body;
    await Leave.create({ employee: req.employee._id, date, reason });
    res.redirect('/leave');
});

module.exports = router;
