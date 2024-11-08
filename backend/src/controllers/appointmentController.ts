import { Request, Response } from 'express';
import pool from '../config/db';

interface AppointmentRequestBody {
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  status?: string;
}

// Create Appointment
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

// Get All Appointments with Patient, Doctor, and Department Names
export const getAllAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = `
      SELECT 
        a.appointment_id, 
        p.first_name || ' ' || p.last_name AS patient_name, 
        s.first_name || ' ' || s.last_name AS doctor_name, 
        d.department_name, 
        a.appointment_date, 
        a.check_in_time, 
        a.status 
      FROM 
        Appointments a
      JOIN 
        Patients p ON a.patient_id = p.patient_id
      JOIN 
        Staff s ON a.doctor_id = s.staff_id
      LEFT JOIN 
        Departments d ON s.department_id = d.department_id
      WHERE 
        a.hospital_id = $1;
    `;

    const result = await pool.query(query, [(req as any).user.hospital_id]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Appointment by ID
export const getAppointmentById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const query = `
      SELECT 
        a.appointment_id, 
        p.first_name || ' ' || p.last_name AS patient_name, 
        s.first_name || ' ' || s.last_name AS doctor_name, 
        d.department_name, 
        a.appointment_date, 
        a.check_in_time, 
        a.status 
      FROM 
        Appointments a
      JOIN 
        Patients p ON a.patient_id = p.patient_id
      JOIN 
        Staff s ON a.doctor_id = s.staff_id
      LEFT JOIN 
        Departments d ON s.department_id = d.department_id
      WHERE 
        a.appointment_id = $1;
    `;
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

// Cancel (Delete) Appointment
export const cancelAppointment = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
  
    try {
      const query = `DELETE FROM Appointments WHERE appointment_id = $1 RETURNING appointment_id;`;
      const result = await pool.query(query, [id]);
  
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Appointment not found' });
        return;
      }
  
      res.status(200).json({
        message: 'Appointment canceled and deleted successfully',
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
