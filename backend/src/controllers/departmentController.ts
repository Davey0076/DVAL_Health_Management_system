import { Request, Response } from 'express';
import pool from '../config/db';

// Helper function to check admin
const isAdmin = (req: Request): boolean => (req as any).user && (req as any).user.role === 'Admin';


interface DepartmentRequestBody {
    department_name: string;
    location?: string;
}

interface DepartmentQueryParams {
    department_name?: string;
}

//Create Department
export const createDepartment = async (req: Request, res: Response): Promise<void> => {
    if (!isAdmin(req)) {
        res.status(403).json({ message: 'Only admins can create departments' });
        return;
    }

    const { department_name, location }: DepartmentRequestBody = req.body;
    const hospital_id = (req as any).user.hospital_id;

    if (!department_name) {
        res.status(400).json({ message: 'Department name is required' });
        return;
    }

    try {
        const query = `
            INSERT INTO Departments (hospital_id, department_name, location)
            VALUES ($1, $2, $3)
            RETURNING department_id, hospital_id, department_name, location;
        `;
        const values = [hospital_id, department_name, location];
        const result = await pool.query(query, values);

        res.status(201).json({
            message: 'Department created successfully',
            department: result.rows[0]
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error creating department:', error.message);
        } else {
            console.error('Error creating department:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};

//Get All Departments
export const getAllDepartments = async (req: Request, res: Response): Promise<void> => {
    const hospital_id = (req as any).user.hospital_id;
    const { department_name }: DepartmentQueryParams = req.query;

    try {
        let query = `SELECT * FROM Departments WHERE hospital_id = $1`;
        const values = [hospital_id];

        if (department_name) {
            query += ` AND department_name ILIKE $${values.length + 1}`;
            values.push(`%${department_name}%`);
        }

        const result = await pool.query(query, values);
        res.status(200).json(result.rows);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error retrieving departments:', error.message);
        } else {
            console.error('Error retrieving departments:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Department by ID
export const getDepartmentById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const hospital_id = (req as any).user.hospital_id;

    try {
        const query = `SELECT * FROM Departments WHERE department_id = $1 AND hospital_id = $2`;
        const result = await pool.query(query, [id, hospital_id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Department not found' });
            return;
        }

        res.status(200).json(result.rows[0]);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error retrieving department:', error.message);
        } else {
            console.error('Error retrieving department:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Update Department
export const updateDepartment = async (req: Request, res: Response): Promise<void> => {
    if (!isAdmin(req)) {
        res.status(403).json({ message: 'Only admins can update departments' });
        return;
    }

    const { id } = req.params;
    const { department_name, location }: DepartmentRequestBody = req.body;
    const hospital_id = (req as any).user.hospital_id;

    try {
        const query = `
            UPDATE Departments
            SET department_name = COALESCE($1, department_name),
                location = COALESCE($2, location)
            WHERE department_id = $3 AND hospital_id = $4
            RETURNING department_id, hospital_id, department_name, location;
        `;
        const values = [department_name, location, id, hospital_id];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Department not found or unauthorized access' });
            return;
        }

        res.status(200).json({
            message: 'Department updated successfully',
            department: result.rows[0]
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error updating department:', error.message);
        } else {
            console.error('Error updating department:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete Department
export const deleteDepartment = async (req: Request, res: Response): Promise<void> => {
    if (!isAdmin(req)) {
        res.status(403).json({ message: 'Only admins can delete departments' });
        return;
    }

    const { id } = req.params;
    const hospital_id = (req as any).user.hospital_id;

    try {
        const query = `DELETE FROM Departments WHERE department_id = $1 AND hospital_id = $2 RETURNING department_id`;
        const result = await pool.query(query, [id, hospital_id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Department not found or unauthorized access' });
            return;
        }

        res.status(200).json({ message: 'Department deleted successfully' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error deleting department:', error.message);
        } else {
            console.error('Error deleting department:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};


export default {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
};
