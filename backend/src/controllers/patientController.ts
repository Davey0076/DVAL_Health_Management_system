import { Request, Response } from 'express';
import pool from '../config/db';


interface PatientRequestBody {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    contact_info?: string;
    residence?: string;
    insurance_id?: number;
    emergency_contact?: string;
}

interface PatientQueryParams {
    name?: string;
    age?: number;
    gender?: string;

}

//Register Patient
export const registerPatient = async (req: Request, res: Response): Promise<void> => {
    const {
        first_name,
        last_name,
        date_of_birth,
        gender,
        contact_info,
        residence,
        insurance_id,
        emergency_contact
    }: PatientRequestBody = req.body;

    const hospital_id = (req as any).user.hospital_id;

   
    if (!first_name || !last_name || !date_of_birth || !gender || !hospital_id) {
        console.log(`${hospital_id}`);
        console.log(`${first_name}`);
        console.log(`${last_name}`);
        console.log(`${gender}`);
        res.status(400).json({ message: 'Missing required fields' });
        return;
    }

    try {
        
        const duplicateCheckQuery = `
            SELECT * FROM Patients 
            WHERE first_name = $1 AND last_name = $2 AND date_of_birth = $3 AND hospital_id = $4
        `;
        const duplicateResult = await pool.query(duplicateCheckQuery, [first_name, last_name, date_of_birth, hospital_id]);

        if (duplicateResult.rows.length > 0) {
            res.status(409).json({ message: 'Patient with the same name and date of birth already exists.' });
            return;
        }

        
        const query = `
            INSERT INTO Patients (
                hospital_id, first_name, last_name, date_of_birth, gender, 
                contact_info, residence, insurance_id, emergency_contact, registration_date
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
            RETURNING patient_id, first_name, last_name, registration_date;
        `;
        const values = [
            hospital_id, first_name, last_name, date_of_birth, gender,
            contact_info, residence, insurance_id, emergency_contact
        ];
        const result = await pool.query(query, values);
        const newPatient = result.rows[0];

        res.status(201).json({
            message: "Patient has been registered successfully",
            patient: newPatient
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error registering patient:', error.message);
        } else {
            console.error('Error registering patient:', error);
        }
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

//Get All Patients with Age
export const getAllPatients = async (req: Request, res: Response): Promise<void> => {
    const { name, age, gender }: PatientQueryParams = req.query;
  
    try {
      let query = `SELECT patient_id, first_name, last_name, date_of_birth, gender, contact_info, age FROM patients WHERE 1=1`;
      const values: Array<string | number> = [];
      
  
      if (name) {
        query += ` AND (first_name ILIKE $${values.length + 1} OR last_name ILIKE $${values.length + 1})`;
        values.push(`${name}`);

       
      }
      if (age) {
        query += ` AND EXTRACT(YEAR FROM age(date_of_birth)) = $${values.length + 1}`;
        values.push(Number(age));
      }
      if (gender) {
        query += ` AND gender = $${values.length + 1}`;
        values.push(gender);
      }
  
      const result = await pool.query(query, values);
      res.status(200).json(result.rows);
    } catch (error: unknown) {
      console.error('Error retrieving patients:', error instanceof Error ? error.message : error);
      res.status(500).json({ message: 'Server error, please try again later.' });
    }
  };
  
  // Retrieve a specific patient by ID with Age
  export const getPatientById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
  
    try {
      const query = `
        SELECT patient_id, first_name, last_name, date_of_birth, gender, contact_info,
               residence, insurance_id, emergency_contact, registration_date,
               EXTRACT(YEAR FROM age(date_of_birth)) AS age
        FROM Patients WHERE patient_id = $1
      `;
      const result = await pool.query(query, [id]);
  
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Patient not found' });
        return;
      }
  
      res.status(200).json(result.rows[0]);
    } catch (error: unknown) {
      console.error('Error retrieving patient:', error instanceof Error ? error.message : error);
      res.status(500).json({ message: 'Server error, please try again later.' });
    }
  };


export default {
    registerPatient,
    getAllPatients,
    getPatientById,
};
