const express = require('express');
const pool = require('./config/db'); // Database connection
const authRoutes = require('./routes/authRoutes'); // Import the authentication routes
const cors = require('cors')


const app = express();
app.use(express.json()); // Middleware to parse JSON requests
app.use(cors())
// Use the auth routes with /auth prefix
app.use('/auth', authRoutes); // This adds /auth/signup and /auth/login routes

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
});