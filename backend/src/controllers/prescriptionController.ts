import { Request, Response } from 'express';
import pool from '../config/db';


interface PrescriptionRequestBody {
    patient_id: number;
    consultation_id: number;
    doctor_id: number;
    medication_name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
    status?: string;
}

interface PrescriptionQueryParams {
    patient_id?: number;
    doctor_id?: number;
    hospital_id?: number;
    status?: string;
    prescribed_date?: string;
}

//Create Prescription
export const createPrescription = async (req: Request, res: Response): Promise<void> => {
    const {
        patient_id,
        consultation_id,
        doctor_id,
        medication_name,
        dosage,
        frequency,
        duration,
        instructions
    }: PrescriptionRequestBody = req.body;
    const hospital_id = (req as any).user.hospital_id;

    if (!patient_id || !consultation_id || !doctor_id || !medication_name || !dosage || !frequency || !duration) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
    }

    try {
        const query = `
            INSERT INTO Prescriptions 
            (patient_id, consultation_id, doctor_id, hospital_id, medication_name, dosage, frequency, duration, instructions, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Active')
            RETURNING prescription_id, patient_id, consultation_id, doctor_id, hospital_id, medication_name, dosage, frequency, duration, instructions, status, prescribed_date;
        `;
        
        const values = [patient_id, consultation_id, doctor_id, hospital_id, medication_name, dosage, frequency, duration, instructions];
        const result = await pool.query(query, values);

        res.status(201).json({
            message: 'Prescription created successfully',
            prescription: result.rows[0]
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error creating prescription:', error.message);
        } else {
            console.error('Error creating prescription:', error);
        }
        res.status(500).json({ message: 'Server error encountered' });
    }
};

//Get All Prescriptions
export const getAllPrescriptions = async (req: Request, res: Response): Promise<void> => {
    const { patient_id, doctor_id, hospital_id, status, prescribed_date }: PrescriptionQueryParams = req.query;

    try {
        let query = `SELECT * FROM Prescriptions WHERE 1=1`;
        const values: (string | number)[] = [];

        if (patient_id) {
            query += ` AND patient_id = $${values.length + 1}`;
            values.push(patient_id);
        }
        if (doctor_id) {
            query += ` AND doctor_id = $${values.length + 1}`;
            values.push(doctor_id);
        }
        if (hospital_id) {
            query += ` AND hospital_id = $${values.length + 1}`;
            values.push(hospital_id);
        }
        if (status) {
            query += ` AND status = $${values.length + 1}`;
            values.push(status);
        }
        if (prescribed_date) {
            query += ` AND DATE(prescribed_date) = $${values.length + 1}`;
            values.push(prescribed_date);
        }

        const result = await pool.query(query, values);
        res.status(200).json(result.rows);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error retrieving prescriptions:', error.message);
        } else {
            console.error('Error retrieving prescriptions:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};

//Get Prescription by ID
export const getPrescriptionById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const query = `SELECT * FROM Prescriptions WHERE prescription_id = $1`;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Prescription not found' });
            return;
        }

        res.status(200).json(result.rows[0]);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error retrieving prescription:', error.message);
        } else {
            console.error('Error retrieving prescription:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};

//Update Prescription
export const updatePrescription = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status, dosage, frequency, duration, instructions }: Partial<PrescriptionRequestBody> = req.body;

    try {
        const query = `
            UPDATE Prescriptions
            SET status = COALESCE($1, status),
                dosage = COALESCE($2, dosage),
                frequency = COALESCE($3, frequency),
                duration = COALESCE($4, duration),
                instructions = COALESCE($5, instructions)
            WHERE prescription_id = $6
            RETURNING prescription_id, patient_id, consultation_id, doctor_id, hospital_id, medication_name, dosage, frequency, duration, instructions, status, prescribed_date;
        `;

        const values = [status, dosage, frequency, duration, instructions, id];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Prescription not found' });
            return;
        }

        res.status(200).json({
            message: 'Prescription updated successfully',
            prescription: result.rows[0]
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error updating prescription:', error.message);
        } else {
            console.error('Error updating prescription:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// 5. Delete Prescription (optional)
export const deletePrescription = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const query = `DELETE FROM Prescriptions WHERE prescription_id = $1 RETURNING prescription_id`;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Prescription not found' });
            return;
        }

        res.status(200).json({ message: 'Prescription deleted successfully' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error deleting prescription:', error.message);
        } else {
            console.error('Error deleting prescription:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};


export default {
    createPrescription,
    getAllPrescriptions,
    getPrescriptionById,
    updatePrescription,
    deletePrescription
};
