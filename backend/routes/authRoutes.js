const express = require('express');
const { signup, login } = require('../controllers/authController'); // Importing functions from authController

const router = express.Router();

// Signup route - registers both admin and hospital details
router.post('/signup', signup);

// Login route
router.post('/login', login);

module.exports = router;
