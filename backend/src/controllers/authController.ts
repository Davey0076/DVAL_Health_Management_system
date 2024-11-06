// authController.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import pool from '../config/db';

// Set up the JWT secret with fallback
const JWT_SECRET = process.env.JWT_SECRET || 'my_jwt_secret_key';

// Define interfaces for request bodies
interface SignupRequestBody {
  full_name: string;
  email: string;
  password: string;
  national_id: string;
  kra_pin: string;
  contact_number: string;
  role?: string;
  hospital_name: string;
  registration_number: string;
  location: string;
  type: string;
  contact_info: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

// JWT payload structure
interface JwtPayload {
  userId: number;
  role: string;
  hospital_id: number | null;
}

// Controller for user signup (Admin and Hospital registration)
export const signup = async (req: Request, res: Response): Promise<void> => {
  const {
    full_name,
    email,
    password,
    national_id,
    kra_pin,
    contact_number,
    role = 'Admin',
    hospital_name,
    registration_number,
    location,
    type,
    contact_info,
  }: SignupRequestBody = req.body;

  try {
    // Check if Admin already exists by email
    const userCheck = await pool.query('SELECT * FROM Admin WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      res.status(400).json({ message: 'User with this email already exists' });
      return;
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

    // Insert Hospital details, linking to the created admin_id, and retrieve hospital_id
    const hospitalResult = await pool.query(
      `INSERT INTO Hospital (hospital_name, registration_number, location, type, contact_info, admin_id) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING hospital_id`,
      [hospital_name, registration_number, location, type, contact_info, adminId]
    );

    const hospitalId = hospitalResult.rows[0].hospital_id;

    // Generate JWT token after successful registration, including hospital_id
    const token = jwt.sign(
      { userId: adminId, role, hospital_id: hospitalId } as JwtPayload,
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ message: 'User and Hospital registered successfully', token });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Signup Error:', error.message);
    } else {
      console.error('Signup Error: An unknown error occurred');
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller for user login
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password }: LoginRequestBody = req.body;

  try {
    // Check if user exists
    const userResult = await pool.query('SELECT * FROM Admin WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const user = userResult.rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Retrieve the hospital_id associated with the admin
    const hospitalResult = await pool.query(
      'SELECT hospital_id FROM Hospital WHERE admin_id = $1',
      [user.admin_id]
    );

    const hospitalId = hospitalResult.rows.length > 0 ? hospitalResult.rows[0].hospital_id : null;

    // Generate JWT token on successful login, including hospital_id
    const token = jwt.sign(
      { userId: user.admin_id, role: user.role, hospital_id: hospitalId } as JwtPayload,
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Login Error:', error.message);
    } else {
      console.error('Login Error: An unknown error occurred');
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Export the controllers
export default {
  signup,
  login,
};
