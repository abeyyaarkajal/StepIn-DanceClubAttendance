const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Students = require('../models/Students');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_change_this';
const ADMIN_CREDENTIALS = {
    username: 'admin1',
    password: 'natrajdata'
};

// Login Route
router.post('/login', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        // Admin Login
        if (role === 'admin') {
            if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
                const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
                return res.json({ token, role: 'admin', user: { name: 'Administrator' } });
            }
            return res.status(401).json({ error: 'Invalid admin credentials' });
        }

        // Student Login
        if (role === 'student') {
            const student = await Students.findOne({ rollNumber: username });
            if (!student) {
                return res.status(404).json({ error: 'Student not found' });
            }

            const isMatch = await bcrypt.compare(password, student.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid password' });
            }

            const token = jwt.sign({ role: 'student', id: student._id }, JWT_SECRET, { expiresIn: '1d' });
            return res.json({
                token,
                role: 'student',
                user: {
                    id: student._id,
                    name: student.name,
                    rollNumber: student.rollNumber
                }
            });
        }

        return res.status(400).json({ error: 'Invalid role selected' });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

module.exports = router;
