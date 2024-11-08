// PatientRegistration.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PatientRegistration.component.css'

const PatientRegistration: React.FC = () => {
  const [patient, setPatient] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    contact_info: '',
    residence: '',
    emergency_contact: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/register-patient',
        patient,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        setSuccessMessage('Patient registered successfully');
        setPatient({
          first_name: '',
          last_name: '',
          date_of_birth: '',
          gender: '',
          contact_info: '',
          residence: '',
          emergency_contact: '',
        });
        
        // Navigate to a patient list page after waiting for 1 seconds
        setTimeout(() => {
          navigate('/patient-management'); 
        }, 1000);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.message || 'Failed to register patient');
      } else {
        setErrorMessage('An unexpected error occurred');
      }
    }
  };

  return (
    <div>
      
      <form onSubmit={handleSubmit} className='registration-form'>
      <h2>Register New Patient</h2>
        <div className='form-input-area'>
          <label>First Name:</label>
          <input type="text" name="first_name" value={patient.first_name} onChange={handleInputChange} required />
        </div>
        <div className='form-input-area'>
          <label>Last Name:</label>
          <input type="text" name="last_name" value={patient.last_name} onChange={handleInputChange} required />
        </div>
        <div className='form-input-area'>
          <label>Date of Birth:</label>
          <input type="date" name="date_of_birth" value={patient.date_of_birth} onChange={handleInputChange} required />
        </div>
        <div className='form-input-area'>
          <label>Gender:</label>
          <input type="text" name="gender" value={patient.gender} onChange={handleInputChange} required />
        </div>
        <div className='form-input-area'>
          <label>Contact Info:</label>
          <input type="text" name="contact_info" value={patient.contact_info} onChange={handleInputChange} />
        </div>
        <div className='form-input-area'>
          <label>Residence:</label>
          <input type="text" name="residence" value={patient.residence} onChange={handleInputChange} />
        </div>

        <div className='form-input-area'>
          <label>Emergency Contact:</label>
          <input type="text" name="emergency_contact" value={patient.emergency_contact} onChange={handleInputChange} />
        </div>
        <button type="submit">Register Patient</button>
      </form>

      {/* Display messages */}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default PatientRegistration;
