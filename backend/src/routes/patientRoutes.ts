import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import {
    registerPatient,
    getAllPatients,
    getPatientById
} from '../controllers/patientController';

const router = Router();


router.post('/register-patient', authMiddleware, registerPatient);

router.get('/patients', authMiddleware, getAllPatients);

router.get('/patients/:id', authMiddleware, getPatientById);



export default router;
