import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './AppointmentForm.component.css'

interface AppointmentFormProps {
  
}

interface Doctor {
  doctor_id: number;
  full_name: string;
}

const AppointmentForm: React.FC<AppointmentFormProps> = () => {
  const { state } = useLocation();
  const { patientId, patientName } = state || {};
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<number | ''>('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/staff/all-staff', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setDoctors(
          response.data
            .filter((staff: any) => staff.role === 'Doctor')
            .map((doctor: any) => ({
              doctor_id: doctor.staff_id,
              full_name: `${doctor.first_name} ${doctor.last_name}`,
            }))
        );
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const appointmentDateTime = `${appointmentDate}T${appointmentTime}`;

    try {
      await axios.post(
        'http://localhost:5000/appointments',
        {
          patient_id: patientId,
          doctor_id: selectedDoctor,
          appointment_date: appointmentDateTime,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Appointment created successfully.\n To view all scheduled appointments, go to appointments section');
      navigate('/all-appointments');
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Failed to create appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="appointment-form-container">
      <h2>Create Appointment for {patientName}</h2>
      <form onSubmit={handleSubmit} className='appointment-form'>
        <label>Patient:</label>
        <input type="text" value={patientName} readOnly />

        <label>Doctor:</label>
        <select
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(Number(e.target.value))}
          required
        >
          <option value="">Select a doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.doctor_id} value={doctor.doctor_id}>
              {doctor.full_name}
            </option>
          ))}
        </select>

        <label>Appointment Date:</label>
        <input
          type="date"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
          required
        />

        <label>Appointment Time:</label>
        <input
          type="time"
          value={appointmentTime}
          onChange={(e) => setAppointmentTime(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Appointment'}
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
