import { Request, Response } from 'express';
import pool from '../config/db';


interface MedicalRecordRequestBody {
    patient_id: number;
    doctor_id: number;
    diagnosis?: string;
    treatment?: string;
    prescription?: string;
    weight?: number;
    blood_pressure?: string;
    temperature?: number;
    heart_rate?: number;
    notes?: string;
}

interface UpdateMedicalRecordRequestBody {
    diagnosis?: string;
    treatment?: string;
    prescription?: string;
    weight?: number;
    blood_pressure?: string;
    temperature?: number;
    heart_rate?: number;
    notes?: string;
}

interface MedicalRecordQueryParams {
    patient_id?: number;
    doctor_id?: number;
    hospital_id?: number;
    record_date?: string;
}

//Create Medical Record
export const createMedicalRecord = async (req: Request, res: Response): Promise<void> => {
    const {
        patient_id,
        doctor_id,
        diagnosis,
        treatment,
        prescription,
        weight,
        blood_pressure,
        temperature,
        heart_rate,
        notes
    }: MedicalRecordRequestBody = req.body;
    const hospital_id = (req as any).user.hospital_id;

    if (!patient_id || !doctor_id || !hospital_id) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
    }

    try {
        const query = `
            INSERT INTO medicalrecords 
            (patient_id, doctor_id, hospital_id, diagnosis, treatment, prescription, weight, blood_pressure, temperature, heart_rate, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING record_id, patient_id, doctor_id, hospital_id, diagnosis, treatment, prescription, weight, blood_pressure, temperature, heart_rate, notes, record_date;
        `;
        const values = [patient_id, doctor_id, hospital_id, diagnosis, treatment, prescription, weight, blood_pressure, temperature, heart_rate, notes];
        const result = await pool.query(query, values);

        res.status(201).json({
            message: 'Medical record created successfully',
            medicalRecord: result.rows[0]
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error creating medical record:', error.message);
        } else {
            console.error('Error creating medical record:', error);
        }
        res.status(500).json({ message: 'An internal server error has been encountered' });
    }
};

//Get All Medical Records
export const getAllMedicalRecords = async (req: Request, res: Response): Promise<void> => {
    const { patient_id, doctor_id, hospital_id, record_date }: MedicalRecordQueryParams = req.query;

    try {
        let query = `SELECT * FROM MedicalRecords WHERE 1=1`;
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
        if (record_date) {
            query += ` AND DATE(record_date) = $${values.length + 1}`;
            values.push(record_date);
        }

        const result = await pool.query(query, values);
        res.status(200).json(result.rows);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error retrieving medical records:', error.message);
        } else {
            console.error('Error retrieving medical records:', error);
        }
        res.status(500).json({ message: 'Error retrieving medical records from the server' });
    }
};

//Get Medical Record by ID
export const getMedicalRecordById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const query = `SELECT * FROM MedicalRecords WHERE record_id = $1`;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Medical record not found' });
            return;
        }

        res.status(200).json(result.rows[0]);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error retrieving medical record:', error.message);
        } else {
            console.error('Error retrieving medical record:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};

//Update Medical Record
export const updateMedicalRecord = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const {
        diagnosis,
        treatment,
        prescription,
        weight,
        blood_pressure,
        temperature,
        heart_rate,
        notes
    }: UpdateMedicalRecordRequestBody = req.body;

    try {
        const query = `
            UPDATE MedicalRecords
            SET diagnosis = COALESCE($1, diagnosis),
                treatment = COALESCE($2, treatment),
                prescription = COALESCE($3, prescription),
                weight = COALESCE($4, weight),
                blood_pressure = COALESCE($5, blood_pressure),
                temperature = COALESCE($6, temperature),
                heart_rate = COALESCE($7, heart_rate),
                notes = COALESCE($8, notes),
                updated_at = CURRENT_TIMESTAMP
            WHERE record_id = $9
            RETURNING record_id, patient_id, doctor_id, hospital_id, diagnosis, treatment, prescription, weight, blood_pressure, temperature, heart_rate, notes, record_date;
        `;
        const values = [diagnosis, treatment, prescription, weight, blood_pressure, temperature, heart_rate, notes, id];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Medical record not found' });
            return;
        }

        res.status(200).json({
            message: 'Medical record updated successfully',
            medicalRecord: result.rows[0]
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error updating medical record:', error.message);
        } else {
            console.error('Error updating medical record:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};

//Delete Medical Record (optional)
export const deleteMedicalRecord = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const query = `DELETE FROM MedicalRecords WHERE record_id = $1 RETURNING record_id`;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Medical record not found' });
            return;
        }

        res.status(200).json({ message: 'Medical record deleted successfully' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error deleting medical record:', error.message);
        } else {
            console.error('Error deleting medical record:', error);
        }
        res.status(500).json({ message: 'Server error' });
    }
};


export default {
    createMedicalRecord,
    getAllMedicalRecords,
    getMedicalRecordById,
    updateMedicalRecord,
    deleteMedicalRecord,
};
