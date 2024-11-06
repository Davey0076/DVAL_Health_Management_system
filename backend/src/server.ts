import express, { Request, Response, NextFunction } from 'express';
require('dotenv').config();
import cors from 'cors';
import hospitalRoutes from './routes/hospitalRoutes';
import authRoutes from './routes/authRoutes';
import patientRoutes from './routes/patientRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import staffRoutes from './routes/staffRoutes';
import departmentRoutes from './routes/departmentRoutes';
import consultationRoutes from './routes/consultationRoutes';
import medicalRecordsRoutes from './routes/medicalRecordsRoutes';
import labTestRoutes from './routes/labTestRoutes';
import prescriptionRoutes from './routes/prescriptionRoutes';
import billingRoutes from './routes/billingRoutes';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Main routes used
app.use('/auth', authRoutes);            
app.use('/staff', staffRoutes);       
app.use('/api', hospitalRoutes);         
app.use('/lab', labTestRoutes);           
app.use('/consultations', consultationRoutes); 
app.use('/departments', departmentRoutes); 
app.use('/api', patientRoutes);           
app.use('/prescriptions', prescriptionRoutes); 
app.use('/records', medicalRecordsRoutes); 
app.use('/bill', billingRoutes);          
app.use('/', appointmentRoutes);          

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.message);
  res.status(500).json({ message: 'Server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
});
