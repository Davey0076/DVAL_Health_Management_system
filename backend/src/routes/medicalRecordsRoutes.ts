import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import {
    createMedicalRecord,
    getAllMedicalRecords,
    getMedicalRecordById,
    updateMedicalRecord,
    deleteMedicalRecord
} from '../controllers/medicalRecordController';

const router = Router();


router.post('/medical-records', authMiddleware, createMedicalRecord);

router.get('/medical-records', authMiddleware, getAllMedicalRecords);

router.get('/medical-records/:id', authMiddleware, getMedicalRecordById);

router.put('/medical-records/:id', authMiddleware, updateMedicalRecord);

router.delete('/medical-records/:id', authMiddleware, deleteMedicalRecord);

export default router;
