const express = require('express');
const pool = require('./config/db'); // Database connection
const authRoutes = require('./routes/authRoutes');
const cors = require('cors')


const app = express();
app.use(express.json());
app.use(cors())
app.use('/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
});
