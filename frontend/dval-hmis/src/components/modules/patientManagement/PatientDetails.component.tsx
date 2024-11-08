import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaStethoscope, FaCalendarCheck, FaClipboardList } from 'react-icons/fa';
import AppointmentForm from './appointments/AppointmentForm.component';
import './PatientDetails.component.css';

interface PatientDetailsProps {
  patientId: number;
}

interface Patient {
  patient_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  contact_info: string;
  residence: string;
  age: number;
  insurance_id?: number;
  emergency_contact: string;
  registration_date: string;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ patientId }) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/patients/${patientId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setPatient(response.data);
      } catch (error) {
        console.error('Error fetching patient details:', error);
      }
    };

    fetchPatientDetails();
  }, [patientId]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  if (!patient) return <p>Loading patient details...</p>;

  return (
    <>
      <div className="patient-details-container">
        <div className="patient-details">
          <h2>Patient Details</h2>
          <p>
            <strong>Name:</strong> {patient.first_name} {patient.last_name}
          </p>
          <p>
            <strong>Date of Birth:</strong> {formatDate(patient.date_of_birth)}
          </p>
          <p>
            <strong>Gender:</strong> {patient.gender}
          </p>
          <p>
            <strong>Contact Info:</strong> {patient.contact_info}
          </p>
          <p>
            <strong>Residence:</strong> {patient.residence}
          </p>
          <p>
            <strong>Age:</strong> {patient.age}
          </p>
          <p>
            <strong>Emergency Contact:</strong> {patient.emergency_contact}
          </p>
          <p>
            <strong>Registration Date:</strong> {formatDate(patient.registration_date)}
          </p>
        </div>

        <div className="service-card-wrapper">
          <div className="service-card" onClick={() =>
              navigate('/appointments', {
                state: { patientId: patient.patient_id, patientName: `${patient.first_name} ${patient.last_name}` },
              })
            }>
            <FaCalendarCheck />
            <p>Create Appointment</p>
          </div>
          {/* Add more service cards for other actions */}
          <div className='service-card'>
    <FaStethoscope />
      <p>2. Create New Consultation</p>
      </div>

      <div className='service-card'>
    <FaClipboardList />
      <p>3. Medical Records</p>
      </div>
        </div>
      </div>

      {/* {showAppointmentForm && (
        <AppointmentForm
          patientId={patient.patient_id}
          patientName={`${patient.first_name} ${patient.last_name}`}
          onClose={() => setShowAppointmentForm(false)}
        />
        
      )} */}
      
    </>
  );
};

export default PatientDetails;
