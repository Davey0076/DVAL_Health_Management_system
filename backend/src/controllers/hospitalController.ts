import { Request, Response } from 'express';
import pool from '../config/db';

// Get Hospital by ID
export const getHospitalById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; 

    try {
        const query = 'SELECT hospital_name, location, contact_info FROM Hospital WHERE hospital_id = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Hospital not found' });
            return;
        }

        res.status(200).json(result.rows[0]); // Return hospital details
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error fetching hospital:', error.message);
        } else {
            console.error('Error fetching hospital:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};

//Get All Hospitals(this will only be limited to the system administrator)
export const getAllHospitals = async (req: Request, res: Response): Promise<void> => {
    try {
        const query = 'SELECT hospital_id, hospital_name, location, contact_info FROM Hospital';
        const result = await pool.query(query);

        res.status(200).json(result.rows);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error fetching hospitals:', error.message);
        } else {
            console.error('Error fetching hospitals:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};


export default {
    getHospitalById,
    getAllHospitals,
};
