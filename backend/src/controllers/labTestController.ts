import { Request, Response } from 'express';
import pool from '../config/db';


interface LabTestRequestBody {
    patient_id: number;
    test_name: string;
    requested_by: string;
    test_type?: string;
}

interface UpdateLabTestRequestBody {
    result?: string;
    status?: string;
    lab_technician_id?: number;
}

interface LabTestQueryParams {
    patient_id?: number;
    requested_by?: string;
    hospital_id?: number;
    status?: string;
    test_date?: string;
}

// Request Lab Test
export const requestLabTest = async (req: Request, res: Response): Promise<void> => {
    const { patient_id, test_name, requested_by, test_type }: LabTestRequestBody = req.body;
    const hospital_id = (req as any).user.hospital_id;

    if (!patient_id || !test_name || !requested_by || !hospital_id) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
    }

    try {
        const query = `
            INSERT INTO LabTests 
            (patient_id, hospital_id, test_name, test_type, requested_by, status)
            VALUES ($1, $2, $3, $4, $5, 'Pending')
            RETURNING test_id, patient_id, hospital_id, test_name, test_type, requested_by, status, test_date;
        `;
        
        const values = [patient_id, hospital_id, test_name, test_type, requested_by];
        const result = await pool.query(query, values);

        res.status(201).json({
            message: 'Lab test requested successfully',
            labTest: result.rows[0]
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error requesting lab test:', error.message);
        } else {
            console.error('Error requesting lab test:', error);
        }
        res.status(500).json({ message: 'Server error encountered' });
    }
};

//Get All Lab Tests
export const getAllLabTests = async (req: Request, res: Response): Promise<void> => {
    const { patient_id, requested_by, hospital_id, status, test_date }: LabTestQueryParams = req.query;

    try {
        let query = `SELECT * FROM LabTests WHERE 1=1`;
        const values: (string | number)[] = [];

        if (patient_id) {
            query += ` AND patient_id = $${values.length + 1}`;
            values.push(patient_id);
        }
        if (requested_by) {
            query += ` AND requested_by = $${values.length + 1}`;
            values.push(requested_by);
        }
        if (hospital_id) {
            query += ` AND hospital_id = $${values.length + 1}`;
            values.push(hospital_id);
        }
        if (status) {
            query += ` AND status = $${values.length + 1}`;
            values.push(status);
        }
        if (test_date) {
            query += ` AND DATE(test_date) = $${values.length + 1}`;
            values.push(test_date);
        }

        const result = await pool.query(query, values);
        res.status(200).json(result.rows);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error retrieving lab tests:', error.message);
        } else {
            console.error('Error retrieving lab tests:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Lab Test by ID
export const getLabTestById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const query = `SELECT * FROM LabTests WHERE test_id = $1`;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Lab test not found' });
            return;
        }

        res.status(200).json(result.rows[0]);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error retrieving lab test:', error.message);
        } else {
            console.error('Error retrieving lab test:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Update Lab Test
export const updateLabTest = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { result, status, lab_technician_id }: UpdateLabTestRequestBody = req.body;

    try {
        const query = `
            UPDATE LabTests
            SET result = COALESCE($1, result),
                status = COALESCE($2, status),
                lab_technician_id = COALESCE($3, lab_technician_id),
                test_date = CURRENT_TIMESTAMP
            WHERE test_id = $4
            RETURNING test_id, patient_id, hospital_id, test_name, result, status, lab_technician_id, test_date;
        `;

        const values = [result, status, lab_technician_id, id];
        const resultQuery = await pool.query(query, values);

        if (resultQuery.rows.length === 0) {
            res.status(404).json({ message: 'Lab test not found' });
            return;
        }

        res.status(200).json({
            message: 'Lab test updated successfully',
            labTest: resultQuery.rows[0]
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error updating lab test:', error.message);
        } else {
            console.error('Error updating lab test:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};

//Delete Lab Test (optional)
export const deleteLabTest = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const query = `DELETE FROM LabTests WHERE test_id = $1 RETURNING test_id`;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Lab test not found' });
            return;
        }

        res.status(200).json({ message: 'Lab test deleted successfully' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error deleting lab test:', error.message);
        } else {
            console.error('Error deleting lab test:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};


export default {
    requestLabTest,
    getAllLabTests,
    getLabTestById,
    updateLabTest,
    deleteLabTest,
};
