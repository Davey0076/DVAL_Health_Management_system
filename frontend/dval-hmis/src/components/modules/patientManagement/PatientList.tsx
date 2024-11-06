import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PatientList.css';
import { Link } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';


interface Patient {
  patient_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  age: number;
  gender: string;
  contact_info: string;
}

interface PatientListProps {
  onSelectPatient: (id: number) => void;
}

const PatientList: React.FC<PatientListProps> = ({ onSelectPatient }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState<number | undefined>(undefined);
  const [genderFilter, setGenderFilter] = useState<string>('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/patients/', {
          params: { name: searchTerm, age: ageFilter, gender: genderFilter },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, [searchTerm, ageFilter, genderFilter]);

  //function to Format date of birth as yyyy-mm-dd
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="patient-list">
      <h2>All Patients</h2>
      
      
      <div className="register-filter-wrapper">
      <Link to="/register-patient" className="service-card-register">
                  <FaUserPlus />
                  Register New Patient
      </Link>

      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="number"
          placeholder="Filter by age"
          value={ageFilter || ''}
          onChange={(e) => setAgeFilter(e.target.value ? parseInt(e.target.value) : undefined)}
        />
        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
        >
          <option value="">Filter by gender</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
      </div>
      </div>
      <div className="table-container">
        <table className="all-patients-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Contact Info</th>
              <th id='actions-row-header'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.patient_id}>
                <td>{`${patient.first_name} ${patient.last_name}`}</td>
                <td>{formatDate(patient.date_of_birth)}</td>
                <td>{patient.age}</td>
                <td>{patient.gender}</td>
                <td>{patient.contact_info}</td>
                <td id='actions-row'>
                  <button onClick={() => onSelectPatient(patient.patient_id)}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientList;
