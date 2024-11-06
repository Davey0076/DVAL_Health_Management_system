import { Request, Response } from 'express';
import pool from '../config/db';

// Define types for the body parameters for clarity and type safety
interface AppointmentRequestBody {
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  status?: string;
}

// Create appointment function
export const createAppointment = async (req: Request, res: Response): Promise<void> => {
    const { patient_id, doctor_id, appointment_date }: AppointmentRequestBody = req.body;
    const hospital_id = (req as any).user.hospital_id; 

    if (!patient_id || !doctor_id || !appointment_date || !hospital_id) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }

    try {
        const check_in_time = new Date();

        const query = `
            INSERT INTO appointments 
            (patient_id, doctor_id, appointment_date, hospital_id, status, check_in_time)
            VALUES ($1, $2, $3, $4, 'Scheduled', $5)
            RETURNING appointment_id, patient_id, doctor_id, appointment_date, status, check_in_time;
        `;
        
        const values = [patient_id, doctor_id, appointment_date, hospital_id, check_in_time];
        const result = await pool.query(query, values);

        res.status(201).json({
            message: "Appointment created successfully",
            appointment: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ message: "Server error encountered" });
    }
};

// Get All Appointments
export const getAllAppointments = async (req: Request, res: Response): Promise<void> => {
    const { doctor_id, patient_id, appointment_date } = req.query;

    try {
        let query = `SELECT * FROM Appointments WHERE 1=1`;
        const values: Array<string | number> = [];

        if (doctor_id) {
            query += ` AND doctor_id = $${values.length + 1}`;
            values.push(Number(doctor_id));
        }
        if (patient_id) {
            query += ` AND patient_id = $${values.length + 1}`;
            values.push(Number(patient_id));
        }
        if (appointment_date) {
            query += ` AND DATE(appointment_date) = $${values.length + 1}`;
            values.push(appointment_date as string);
        }

        const result = await pool.query(query, values);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error retrieving appointments:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

//Get Appointment by ID
export const getAppointmentById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const query = `SELECT * FROM Appointments WHERE appointment_id = $1`;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Appointment not found' });
            return;
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error retrieving appointment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update Appointment
export const updateAppointment = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { doctor_id, appointment_date, status }: AppointmentRequestBody = req.body;

    try {
        const query = `
            UPDATE Appointments
            SET doctor_id = COALESCE($1, doctor_id),
                appointment_date = COALESCE($2, appointment_date),
                status = COALESCE($3, status)
            WHERE appointment_id = $4
            RETURNING appointment_id, patient_id, doctor_id, appointment_date, status, check_in_time, check_out_time;
        `;
        const values = [doctor_id, appointment_date, status, id];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Appointment not found' });
            return;
        }

        res.status(200).json({
            message: 'Appointment updated successfully',
            appointment: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Check Out Appointment
export const checkOutAppointment = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const check_out_time = new Date();

        const query = `
            UPDATE Appointments
            SET check_out_time = $1, status = 'Completed'
            WHERE appointment_id = $2
            RETURNING appointment_id, patient_id, doctor_id, appointment_date, status, check_in_time, check_out_time;
        `;
        
        const result = await pool.query(query, [check_out_time, id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Appointment not found' });
            return;
        }

        res.status(200).json({
            message: 'Appointment checked out successfully',
            appointment: result.rows[0]
        });
    } catch (error) {
        console.error('Error checking out appointment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Cancel Appointment
export const cancelAppointment = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const query = `
            UPDATE Appointments
            SET status = 'Canceled'
            WHERE appointment_id = $1
            RETURNING appointment_id, status;
        `;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Appointment not found' });
            return;
        }

        res.status(200).json({
            message: 'Appointment canceled successfully',
            appointment: result.rows[0]
        });
    } catch (error) {
        console.error('Error canceling appointment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export default {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointment,
    checkOutAppointment,
    cancelAppointment
};
