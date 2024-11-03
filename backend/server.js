const express = require('express');
const pool = require('./config/db'); // Database connection
const authRoutes = require('./routes/authRoutes'); // Import the authentication routes
const patientRoutes =require('./routes/patientRoutes')
const cors = require('cors')


const app = express();
app.use(express.json());
app.use(cors())
app.use('/auth', authRoutes);

//patient routes
app.use('/api', patientRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
});
