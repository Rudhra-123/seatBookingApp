const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { generateToken } = require('./auth'); // Adjust path to match your project

// Replace with your secret key
const JWT_SECRET = 'your_secret_key';

// Middleware for verifying the token from cookies
const auth = (req, res, next) => {
    // Get token from cookies
    const token = req.cookies?.authToken;

    // Check if token exists
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach the user info to the request object
        next(); // Proceed to the next middleware/route handler
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
};

// Function for generating and sending the token as a cookie
const generateToken = (user, res) => {
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    // Send the token in an HTTP-only cookie
    res.cookie('authToken', token, {
        httpOnly: true, // Prevent access via JavaScript
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 3600000, // 1 hour in milliseconds
    });

    return token;
};


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Replace this with your database validation logic
    const user = { id: 1, email: 'user@example.com' }; // Mock user

    if (email === user.email && password === 'password123') {
        generateToken(user, res); // Send token in cookies
        return res.status(200).json({ message: 'Login successful!' });
    }

    res.status(401).json({ message: 'Invalid credentials.' });
});

module.exports = { auth, generateToken };
