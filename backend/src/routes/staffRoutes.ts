import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import {
    createStaff,
    getAllStaff,
    getStaffById,
    updateStaff,
    deleteStaff,
    staffLogin
} from '../controllers/staffController';

const router = Router();


router.post('/create-staff', authMiddleware, createStaff);  
router.get('/all-staff', authMiddleware, getAllStaff);      
router.get('/staff/:id', authMiddleware, getStaffById);
router.put('/staff/:id', authMiddleware, updateStaff);     
router.delete('/staff/:id', authMiddleware, deleteStaff);   
router.post('/login', staffLogin);                          

export default router;
