import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/modules/Auth/Login';
import Signup from './components/modules/Auth/Signup';
import PatientManagementPage from "./components/modules/patientManagement/PatientManagementPage";
import Dashboard from './components/Dashboard';
import PatientRegistration from "./components/modules/patientManagement/PatientRegistration.component";

import './App.css'

function App() {

  return (
   <BrowserRouter>
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/patient-management' element={<PatientManagementPage />} />
      <Route path="/register-patient" element={<PatientRegistration />} />

    </Routes>
   </BrowserRouter>
  )
}

export default App
