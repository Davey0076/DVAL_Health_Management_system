const pool = require('../config/db')

const registerPatient = async (req, res) => {
    const {
        first_name,
        last_name,
        date_of_birth,
        gender,
        contact_info,
        residence,
        insurance_id,
        emergency_contact
    } = req.body;

    const hospital_id = req.user.hospital_id;

    // Check required fields
    if (!first_name || !last_name || !date_of_birth || !gender || !hospital_id) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Check if a patient with the same name and date of birth already exists
        const duplicateCheckQuery = `
            SELECT * FROM Patients 
            WHERE first_name = $1 AND last_name = $2 AND date_of_birth = $3 AND hospital_id = $4
        `;
        const duplicateResult = await pool.query(duplicateCheckQuery, [first_name, last_name, date_of_birth, hospital_id]);

        if (duplicateResult.rows.length > 0) {
            return res.status(409).json({ message: 'Patient with the same name and date of birth already exists.' });
        }

        // Proceed with inserting new patient if no duplicate found
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

    } catch (error) {
        console.error('Error registering patient:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};


const getAllPatients = async (req, res) => {
    const { name } = req.query;

    try{
        let query = `SELECT * FROM patients`
        const values = []

        if (name){
            query += `WHERE first_name ILIKE $1 OR last_name ILIKE $1`
            values.push(`%${name}%`)
        }
        const result = await pool.query(query, values)
        res.status(200).json(result.rows);
    }
    catch(error){
        console.error('Error retrieving patients:', error);
    res.status(500).json({ message: 'Server error, please try again later.' });
    }
}

// Retrieve a specific patient by ID
const getPatientById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const query = 'SELECT * FROM Patients WHERE patient_id = $1';
      const result = await pool.query(query, [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error retrieving patient:', error);
      res.status(500).json({ message: 'Server error, please try again later.' });
    }
  };
  
  // Export all controller functions
  module.exports = {
    registerPatient,
    getAllPatients,
    getPatientById
  };