import { Request, Response } from 'express';
import pool from '../config/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_token';

interface CreateStaffRequestBody {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    department_id: number;
    contact_info: string;
}

interface UpdateStaffRequestBody {
    role?: string;
    department_id?: number;
    contact_info?: string;
}

interface StaffLoginRequestBody {
    email: string;
    password: string;
}


const isAdmin = (req: Request): boolean => (req as any).user && (req as any).user.role === 'Admin';

// Create New Staff Member
export const createStaff = async (req: Request, res: Response): Promise<void> => {
    if (!isAdmin(req)) {
        res.status(403).json({ message: 'Only admins can create staff members' });
        return;
    }

    const { first_name, last_name, email, role, department_id, contact_info }: CreateStaffRequestBody = req.body;
    const hospital_id = (req as any).user.hospital_id;
    const employment_date = new Date(); 
    const temporaryPassword = Math.random().toString(36).slice(-8);

    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    try {
        const query = `
            INSERT INTO Staff (hospital_id, department_id, first_name, last_name, email, password_hash, role, contact_info, employment_date)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING staff_id, hospital_id, department_id, first_name, last_name, email, role, contact_info, employment_date;
        `;
        const values = [hospital_id, department_id, first_name, last_name, email, hashedPassword, role, contact_info, employment_date];
        const result = await pool.query(query, values);

        res.status(201).json({
            message: 'Staff member created successfully',
            staff: result.rows[0],
            temporaryPassword 
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error creating staff member:', error.message);
        } else {
            console.error('Error creating staff member:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};

//Get All Staff Members
export const getAllStaff = async (req: Request, res: Response): Promise<void> => {
    const hospital_id = (req as any).user.hospital_id;
    const { role, department_id } = req.query;

    try {
        let query = `SELECT * FROM Staff WHERE hospital_id = $1`;
        const values: (string | number)[] = [hospital_id];

        if (role) {
            query += ` AND role = $${values.length + 1}`;
            values.push(role as string);
        }
        if (department_id) {
            query += ` AND department_id = $${values.length + 1}`;
            values.push(parseInt(department_id as string));
        }

        const result = await pool.query(query, values);
        res.status(200).json(result.rows);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error retrieving staff:', error.message);
        } else {
            console.error('Error retrieving staff:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};

//Get Staff Member by ID
export const getStaffById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const hospital_id = (req as any).user.hospital_id;

    try {
        const query = `SELECT * FROM Staff WHERE staff_id = $1 AND hospital_id = $2`;
        const result = await pool.query(query, [parseInt(id), hospital_id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Staff member not found' });
            return;
        }

        res.status(200).json(result.rows[0]);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error retrieving staff member:', error.message);
        } else {
            console.error('Error retrieving staff member:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};

//Update Staff Member
export const updateStaff = async (req: Request, res: Response): Promise<void> => {
    if (!isAdmin(req)) {
        res.status(403).json({ message: 'Only admins can update staff members' });
        return;
    }

    const { id } = req.params;
    const { role, department_id, contact_info }: UpdateStaffRequestBody = req.body;
    const hospital_id = (req as any).user.hospital_id;

    try {
        const query = `
            UPDATE Staff
            SET role = COALESCE($1, role),
                department_id = COALESCE($2, department_id),
                contact_info = COALESCE($3, contact_info)
            WHERE staff_id = $4 AND hospital_id = $5
            RETURNING staff_id, first_name, last_name, email, role, department_id, contact_info, employment_date;
        `;
        const values = [role, department_id, contact_info, parseInt(id), hospital_id];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Staff member not found or unauthorized access' });
            return;
        }

        res.status(200).json({
            message: 'Staff member updated successfully',
            staff: result.rows[0]
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error updating staff member:', error.message);
        } else {
            console.error('Error updating staff member:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};

//Delete Staff Member
export const deleteStaff = async (req: Request, res: Response): Promise<void> => {
    if (!isAdmin(req)) {
        res.status(403).json({ message: 'Only admins can delete staff members' });
        return;
    }

    const { id } = req.params;
    const hospital_id = (req as any).user.hospital_id;

    try {
        const query = `DELETE FROM staff WHERE staff_id = $1 AND hospital_id = $2 RETURNING staff_id`;
        const result = await pool.query(query, [parseInt(id), hospital_id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Staff member not found or unauthorized access' });
            return;
        }

        res.status(200).json({ message: 'Staff member deleted successfully' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error deleting staff member:', error.message);
        } else {
            console.error('Error deleting staff member:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};

//Staff Login
export const staffLogin = async (req: Request, res: Response): Promise<void> => {
    const { email, password }: StaffLoginRequestBody = req.body;

    try {
        const result = await pool.query('SELECT * FROM staff WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }

        const staff = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, staff.password_hash);
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }

        const token = jwt.sign(
            { staffId: staff.staff_id, role: staff.role, department_id: staff.department_id, hospital_id: staff.hospital_id },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ message: 'Login successful', token });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error logging in:', error.message);
        } else {
            console.error('Error logging in:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};


export default {
    createStaff,
    getAllStaff,
    getStaffById,
    updateStaff,
    deleteStaff,
    staffLogin
};
