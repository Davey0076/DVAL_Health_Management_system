import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import {
    createPrescription,
    getAllPrescriptions,
    getPrescriptionById,
    updatePrescription,
    deletePrescription
} from '../controllers/prescriptionController';

const router = Router();


router.post('/new-prescription', authMiddleware, createPrescription);

router.get('/all-prescriptions', authMiddleware, getAllPrescriptions);

router.get('/prescriptions/:id', authMiddleware, getPrescriptionById);

router.put('/prescriptions/:id', authMiddleware, updatePrescription);

router.delete('/prescriptions/:id', authMiddleware, deletePrescription);

export default router;
