import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";


import './Dashboard.css';
import {
  FaBell,
  FaPowerOff,
  FaUserPlus, 
  FaStethoscope, 
  FaFileMedicalAlt,
  FaCalendarCheck, 
} from 'react-icons/fa'; //import react-icons library with commonly used icons

type Props = {};

function Dashboard({}: Props) {
  const navigate = useNavigate();
  const [hospitalName, setHospitalName] = useState('');

  // Fetch hospital name on component mount
  useEffect(() => {
    const fetchHospitalName = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Decode the token to get hospital_id
          const decodedToken = jwtDecode<{ hospital_id: number }>(token);
          const hospitalId = decodedToken.hospital_id;
          console.log(hospitalId)

          // Fetch hospital name using hospital_id of the logged in hospital
          //the hospital id had been decoded from the jwt token
          const response = await fetch(`http://localhost:5000/api/hospital/${hospitalId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setHospitalName(data.hospital_name);
          } else {
            console.error('Failed to fetch hospital name');
          }
        }
      } catch (error) {
        console.error('Error fetching hospital name:', error);
      }
    };

    fetchHospitalName();
  }, []);

  // Logout function 
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    alert('You have been logged out.'); 
    navigate('/login'); 
  };

  return (
    <>
      <div className="main-container">
        {/* side bar for the dashboard*/}
        <div className="side-bar">
          <div className="sidebar-items">
            <p>DVAL HMIS</p>
            <p style={{ fontSize: '0.7rem', fontStyle: 'italic' }}>
              Redefining healthcare through better management
            </p>
            <ul>
              <li>Dashboard</li>
              <li><Link to="/patient-management">Patient Management</Link></li>
              <li>Lab Department</li>
              <li>Pharmacy/Inventory Management</li>
              <li>Finance</li>
              <li><Link to='/all-appointments'>Appointments</Link></li>
              <li>Maternity and Ward Section</li>
              <li>Staff</li>
              <li>Additional Services</li>
            </ul>
          </div>
        </div>

        {/* main body container with navbar and other dashboard features*/}
        <div className="main-section">
          <div className="navbar">
          <p id="hospitalName">{hospitalName || 'Loading...'}</p>
            <div className="navbar-btn-section">
              <button>Notifications <FaBell /></button>
              <button onClick={handleLogout}><FaPowerOff /> Logout</button>
            </div>
          </div>
          <hr style={{ width: '100%', color: 'gray' }} />
          <div className="main-body">

            {/* frequent services section */}
            <div className="frequent-services">
              <h2>Frequent Services</h2>

              <div className="frequent-container">
                <Link to="/register-patient" className="service-card">
                  <FaUserPlus />
                  Register New Patient
                </Link>
                <Link to="/new-consultation" className="service-card">
                  <FaStethoscope />
                  New Consultation
                </Link>
                <Link to="/lab-reports" className="service-card">
                  <FaFileMedicalAlt />
                  Lab Reports
                </Link>
                <Link to="/appointments" className="service-card">
                  <FaCalendarCheck />
                  Appointments
                </Link>
              </div>
            </div>

            {/* statistics section, more implementation of this will be done later, with visualizations such as graphs */}
            <div className="statistics-section">
              <h2>Statistics</h2>
              <div className="patient-count-card">
                <p id="card-title">
                  Registered <br />
                  Patients
                </p>
                <p id="registered-patients">10</p>
              </div>
            </div>
          </div>
          <div className="main-footer"></div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
