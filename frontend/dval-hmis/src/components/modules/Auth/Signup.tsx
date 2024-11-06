import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import stethoscope from '../../../assets/images/icons/stethoscope.png';
import graph from '../../../assets/images/icons/medical-graph.png';
import doctor from '../../../assets/images/icons/medical-doctor.png';
import community from '../../../assets/images/icons/community.png';

type Props = {};

export default function Signup({}: Props) {
  const navigate = useNavigate(); 
  const [showPersonalInfo, setShowPersonalInfo] = useState(true);
  
  // Personal information states for the hospital admin
  const [fullName, setFullName] = useState('');
  const [kra, setKra] = useState('');
  const [nationalid, setNationalid] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  // Hospital information states for hospital being registered
  const [hospitalName, setHospitalName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [hospitalLocation, setHospitalLocation] = useState('');
  const [hospitalType, setHospitalType] = useState('');
  const [hospitalContactInfo, setHospitalContactInfo] = useState('');
  
  // use states for password and repeat password
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  
  const handlePersonalInfoClick = () => {
    setShowPersonalInfo(true);
  };

  const handleHospitalInfoClick = () => {
    setShowPersonalInfo(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

   
    if (password !== repeatPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      //use signup routes that were defined for signinng up
      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: fullName,
          kra_pin: kra,
          national_id: nationalid,
          email,
          contact_number: contactNumber,
          password,

          
          hospital_name: hospitalName,
          registration_number: registrationNumber,
          location: hospitalLocation,
          type: hospitalType,
          contact_info: hospitalContactInfo
        }),
      });

      if (response.ok) {
        console.log('Signup successful!');
        alert('Signup successful. Redirecting to login')
        navigate('/login')//redirect to login on successful signup
      } else {
        const errorData = await response.json();
        console.error('Signup failed:', errorData);
        alert(`Signup failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('An error occurred during signup. Please try again later.');
    }
  };

  return (
    <div className="signup__container">
      <div className="signup__left__container">
        <img src={stethoscope} alt="stethoscope" id="stethoscope" />
        <p>Join the future of hospital management with integrated technology</p>
        <img src={graph} alt="Medical graph" id="graph" />
        <p>
          Simplify patient data management, improve interdepartmental
          communication, and enhance overall efficiency.
        </p>
        <img src={doctor} alt="doctor" id="doctor" />
        <img src={community} alt="Team of doctors" id="community" />
        <p>
          Join a growing network of healthcare professionals committed to
          providing the best possible patient care
        </p>
        <p style={{ fontWeight: 'bold' }}>
          Join the DAVE-ALUATION community today!!!
        </p>
      </div>
      <div className="signup__right__container">
        <h2>Signup And Registration</h2>
        <div className="btn-selection-signup">
          <button onClick={handlePersonalInfoClick}>
            1. Personal Information
          </button>
          <button onClick={handleHospitalInfoClick}>2. Hospital Information</button>
        </div>

        <form onSubmit={handleSubmit}>
          {showPersonalInfo ? (
            <div className="personal-info-form">
              <h2>Personal Details</h2>
              <div>
                <label htmlFor="fullName">Full Name:</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="kra">KRA PIN:</label>
                <input
                  type="text"
                  id="kra"
                  name="kra"
                  value={kra}
                  onChange={(e) => setKra(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="nationalid">National ID Number:</label>
                <input
                  type="number"
                  id="nationalid"
                  name="nationalid"
                  value={nationalid}
                  onChange={(e) => setNationalid(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="contactNumber">Contact Number:</label>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  required
                />
              </div>
            </div>
          ) : (
            <div className="hospital-info-form">
              <h2>Hospital Details</h2>
              <div>
                <label htmlFor="hospitalName">Hospital Name:</label>
                <input
                  type="text"
                  id="hospitalName"
                  name="hospitalName"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="registrationNumber">Registration Number:</label>
                <input
                  type="text"
                  id="registrationNumber"
                  name="registrationNumber"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="hospitalLocation">Location:</label>
                <input
                  type="text"
                  id="hospitalLocation"
                  name="hospitalLocation"
                  value={hospitalLocation}
                  onChange={(e) => setHospitalLocation(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="hospitalType">Hospital Type:</label>
                <input
                  type="text"
                  id="hospitalType"
                  name="hospitalType"
                  value={hospitalType}
                  onChange={(e) => setHospitalType(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="hospitalContactInfo">Hospital Contact Info:</label>
                <input
                  type="text"
                  id="hospitalContactInfo"
                  name="hospitalContactInfo"
                  value={hospitalContactInfo}
                  onChange={(e) => setHospitalContactInfo(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="repeatPassword">Repeat Password:</label>
                <input
                  type="password"
                  id="repeatPassword"
                  name="repeatPassword"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}
          <p>By signing up, you automatically accept terms and conditions of using our platform</p>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}
