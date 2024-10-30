import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/modules/Auth/Login';
import Signup from './components/modules/Auth/Signup';
import Dashboard from './components/Dashboard';

import './App.css'

function App() {

  return (
   <BrowserRouter>
   <Routes>
    <Route path='/login' element={<Login />} />
    <Route path='/signup' element={<Signup />} />
    <Route path='/dashboard' element={<Dashboard />} />

   </Routes>
   </BrowserRouter>
  )
}

export default App
