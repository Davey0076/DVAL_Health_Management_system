import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import {
  FaHome,
  FaUser,
  FaFlask,
  FaCapsules,
  FaMoneyBillAlt,
  FaBaby,
  FaPlus,
  FaBell,
  FaPowerOff,
  FaUserPlus, // For Register New Patient
  FaStethoscope, // For New Consultation
  FaFileMedicalAlt, // For Lab Reports
  FaCalendarCheck, // For Appointments
} from 'react-icons/fa';

type Props = {};

function Dashboard({}: Props) {
  const navigate = useNavigate(); // Initialize navigation for redirecting

  // Logout function to clear token and navigate to login
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token from localStorage
    alert('You have been logged out.'); // Optional logout message
    navigate('/login'); // Redirect to login page
  };

  return (
    <>
      <div className="main-container">
        {/* side bar for the dashboard, break it down to smaller components later */}
        <div className="side-bar">
          <div className="sidebar-items">
            <p>DVAL HMIS</p>
            <p style={{ fontSize: '0.7rem', fontStyle: 'italic' }}>
              Redefining healthcare through better management
            </p>
            <ul>
              <li>Dashboard</li>
              <li>Patient Management</li>
              <li>Lab Department</li>
              <li>Pharmacy/Inventory Management</li>
              <li>Finance</li>
              <li>Appointments</li>
              <li>Maternity and Ward Section</li>
              <li>Staff</li>
              <li>Additional Services</li>
            </ul>
          </div>
        </div>
        {/* main body */}
        <div className="main-section">
          <div className="navbar">
            <p id="hospitalName">Hospital name</p>
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

            {/* statistics section */}
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
