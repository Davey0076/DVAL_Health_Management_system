import { Router } from 'express';
import {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointment,
    cancelAppointment
} from '../controllers/appointmentController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();


router.post('/appointments', authMiddleware, createAppointment);
router.get('/all-appointments', authMiddleware, getAllAppointments);
router.get('/appointments/:id', authMiddleware, getAppointmentById);
router.put('/appointments/:id', authMiddleware, updateAppointment);
router.delete('/appointments/:id', authMiddleware, cancelAppointment);

export default router;
