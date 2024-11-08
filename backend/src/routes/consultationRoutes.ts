import { Router } from 'express';
import {
    createConsultation,
    getAllConsultations,
    getConsultationById,
    updateConsultation,
    deleteConsultation
} from '../controllers/consultationController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();


router.post('/new-consultation', authMiddleware, createConsultation);
router.get('/all-consultations', authMiddleware, getAllConsultations);
router.get('/:id', authMiddleware, getConsultationById);
router.put('/:id', authMiddleware, updateConsultation);
router.delete('/:id', authMiddleware, deleteConsultation);

export default router;
