import { Request, Response } from 'express';
import pool from '../config/db';


interface ConsultationRequestBody {
    patient_id: number;
    doctor_id: number;
    symptoms: string;
    referred_from?: string;
    referred_to?: string;
    notes?: string;
}

interface UpdateConsultationRequestBody {
    symptoms?: string;
    diagnosis?: string;
    treatment_plan?: string;
    referred_from?: string;
    referred_to?: string;
    notes?: string;
    status?: string;
    follow_up_date?: string;
}

interface ConsultationQueryParams {
    patient_id?: number;
    doctor_id?: number;
    hospital_id?: number;
    status?: string;
}

// Create Consultation
export const createConsultation = async (req: Request, res: Response): Promise<void> => {
    const { patient_id, doctor_id, symptoms, referred_from, referred_to, notes }: ConsultationRequestBody = req.body;
    const hospital_id = (req as any).user.hospital_id; 

    if (!patient_id || !doctor_id || !hospital_id || !symptoms) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
    }

    try {
        const query = `
            INSERT INTO Consultations 
            (patient_id, doctor_id, hospital_id, symptoms, referred_from, referred_to, notes, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, 'Pending')
            RETURNING consultation_id, patient_id, doctor_id, hospital_id, symptoms, referred_from, referred_to, notes, status, consultation_date;
        `;
        
        const values = [patient_id, doctor_id, hospital_id, symptoms, referred_from, referred_to, notes];
        const result = await pool.query(query, values);

        res.status(201).json({
            message: 'Consultation created successfully',
            consultation: result.rows[0]
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error creating consultation:', error.message);
        } else {
            console.error('Error creating consultation:', error);
        }
        res.status(500).json({ message: 'Server error encountered' });
    }
};

// Get All Consultations
export const getAllConsultations = async (req: Request, res: Response): Promise<void> => {
    const { patient_id, doctor_id, hospital_id, status }: ConsultationQueryParams = req.query;

    try {
        let query = `SELECT * FROM Consultations WHERE 1=1`;
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

        const result = await pool.query(query, values);
        res.status(200).json(result.rows);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error retrieving consultations:', error.message);
        } else {
            console.error('Error retrieving consultations:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Consultation by ID
export const getConsultationById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const query = `SELECT * FROM Consultations WHERE consultation_id = $1`;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Consultation not found' });
            return;
        }

        res.status(200).json(result.rows[0]);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error retrieving consultation:', error.message);
        } else {
            console.error('Error retrieving consultation:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Update Consultation
export const updateConsultation = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const {
        symptoms,
        diagnosis,
        treatment_plan,
        referred_from,
        referred_to,
        notes,
        status,
        follow_up_date
    }: UpdateConsultationRequestBody = req.body;

    try {
        const query = `
            UPDATE Consultations
            SET symptoms = COALESCE($1, symptoms),
                diagnosis = COALESCE($2, diagnosis),
                treatment_plan = COALESCE($3, treatment_plan),
                referred_from = COALESCE($4, referred_from),
                referred_to = COALESCE($5, referred_to),
                notes = COALESCE($6, notes),
                status = COALESCE($7, status),
                follow_up_date = COALESCE($8, follow_up_date),
                updated_at = CURRENT_TIMESTAMP
            WHERE consultation_id = $9
            RETURNING consultation_id, patient_id, doctor_id, hospital_id, symptoms, diagnosis, treatment_plan, referred_from, referred_to, notes, status, consultation_date, follow_up_date;
        `;

        const values = [symptoms, diagnosis, treatment_plan, referred_from, referred_to, notes, status, follow_up_date, id];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Consultation not found' });
            return;
        }

        res.status(200).json({
            message: 'Consultation updated successfully',
            consultation: result.rows[0]
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error updating consultation:', error.message);
        } else {
            console.error('Error updating consultation:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete Consultation
export const deleteConsultation = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const query = `DELETE FROM Consultations WHERE consultation_id = $1 RETURNING consultation_id`;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Consultation not found' });
            return;
        }

        res.status(200).json({ message: 'Consultation deleted successfully' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error deleting consultation:', error.message);
        } else {
            console.error('Error deleting consultation:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};


export default {
    createConsultation,
    getAllConsultations,
    getConsultationById,
    updateConsultation,
    deleteConsultation
};
