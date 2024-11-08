import React, { useState } from 'react';
import PatientList from './PatientList.component';
import PatientDetails from './PatientDetails.component';
import './PatientManagementPage.css'


const PatientManagementPage: React.FC = () => {
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

  return (
    <div className="patient-management-page">
      <h1>Patient Management</h1>
    

      <div className="tab-navigation">

        {selectedPatientId && (
          <button onClick={() => setSelectedPatientId(null)}>Back to List</button>
        )}
      </div>

      {selectedPatientId ? (
        <PatientDetails patientId={selectedPatientId} />
      ) : (
        <PatientList onSelectPatient={setSelectedPatientId} />
      )}
    </div>
  );
};

export default PatientManagementPage;
