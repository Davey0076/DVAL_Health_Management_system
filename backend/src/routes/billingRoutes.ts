import { Router } from 'express';
import {
    createBill,
    getAllBills,
    getBillById,
    updateBillStatus,
    deleteBill
} from '../controllers/billingController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();


router.post('/billing', authMiddleware, createBill);

router.get('/billing', authMiddleware, getAllBills);

router.get('/billing/:id', authMiddleware, getBillById);


router.put('/billing/:id', authMiddleware, updateBillStatus);

router.delete('/billing/:id', authMiddleware, deleteBill);

export default router;
