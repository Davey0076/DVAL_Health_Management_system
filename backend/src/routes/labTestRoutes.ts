import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import {
    requestLabTest,
    getAllLabTests,
    getLabTestById,
    updateLabTest,
    deleteLabTest
} from '../controllers/labTestController';

const router = Router();


router.post('/lab-tests', authMiddleware, requestLabTest);


router.get('/lab-tests', authMiddleware, getAllLabTests);


router.get('/lab-tests/:id', authMiddleware, getLabTestById);


router.put('/lab-tests/:id', authMiddleware, updateLabTest);


router.delete('/lab-tests/:id', authMiddleware, deleteLabTest);

export default router;
