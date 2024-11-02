const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); // Database connection pool

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Store this securely in .env

// Controller for user signup (Admin and Hospital registration)
const signup = async (req, res) => {
  const {
    full_name,
    email,
    password,
    national_id,
    kra_pin,
    contact_number,
    role = 'Admin',

    // Hospital details
    hospital_name,
    registration_number,
    location,
    type,
    contact_info
  } = req.body;

  try {
    // Check if Admin already exists by email
    const userCheck = await pool.query('SELECT * FROM Admin WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert Admin details and retrieve admin_id
    const adminResult = await pool.query(
      `INSERT INTO Admin (full_name, email, password_hash, national_id, kra_pin, contact_number, role) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING admin_id`,
      [full_name, email, hashedPassword, national_id, kra_pin, contact_number, role]
    );

    const adminId = adminResult.rows[0].admin_id;

    // Insert Hospital details, linking to the created admin_id
    await pool.query(
      `INSERT INTO Hospital (hospital_name, registration_number, location, type, contact_info, admin_id) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [hospital_name, registration_number, location, type, contact_info, adminId]
    );

    // Generate JWT token after successful registration
    const token = jwt.sign({ userId: adminId, role }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User and Hospital registered successfully', token });
  } catch (error) {
    console.error('Signup Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller for user login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await pool.query('SELECT * FROM Admin WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token on successful login
    const token = jwt.sign(
      { userId: user.rows[0].admin_id, role: user.rows[0].role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  signup,
  login
};
