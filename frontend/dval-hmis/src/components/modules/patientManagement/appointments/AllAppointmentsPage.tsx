import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AllAppointmentsPage.css';

interface Appointment {
  appointment_id: number;
  patient_name: string;
  doctor_name: string;
  department_name: string;
  appointment_date: string;
  check_in_time: string;
  status: string;
}

const AllAppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/all-appointments', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setEditMode(true);
  };

  const handleDelete = async (appointmentId: number) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await axios.delete(`http://localhost:5000/appointments/${appointmentId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        alert('Appointment canceled successfully');
        fetchAppointments();
      } catch (error) {
        console.error('Error canceling appointment:', error);
        alert('Failed to cancel appointment');
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    try {
      await axios.put(
        `http://localhost:5000/appointments/${selectedAppointment.appointment_id}`,
        selectedAppointment,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Appointment updated successfully');
      setEditMode(false);
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment');
    }
  };

  return (
    <div className="appointment-list-container">
      <h2>Scheduled Appointments</h2>
      {loading ? (
        <p>Loading appointments...</p>
      ) : (
        <table className="appointment-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Doctor</th>
              <th>Department</th>
              <th>Appointment Date</th>
              <th>Check-In Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.appointment_id}>
                <td>{appointment.patient_name}</td>
                <td>{appointment.doctor_name}</td>
                <td>{appointment.department_name}</td>
                <td>{new Date(appointment.appointment_date).toLocaleDateString()}</td>
                <td>{appointment.check_in_time ? new Date(appointment.check_in_time).toLocaleTimeString() : 'N/A'}</td>
                <td className={`status ${appointment.status === 'Pending' ? 'pending' : 'completed'}`}>
                  {appointment.status}
                </td>
                <td>
                  <button onClick={() => handleEdit(appointment)}>Edit</button>
                  <button onClick={() => handleDelete(appointment.appointment_id)}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Modal */}
      {editMode && selectedAppointment && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Appointment</h3>
            <form onSubmit={handleEditSubmit}>
              <label>
                Appointment Date:
                <input
                  type="datetime-local"
                  value={selectedAppointment.appointment_date}
                  onChange={(e) =>
                    setSelectedAppointment({ ...selectedAppointment, appointment_date: e.target.value })
                  }
                />
              </label>
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAppointmentsPage;
