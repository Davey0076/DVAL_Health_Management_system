import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import { getHospitalById, getAllHospitals } from '../controllers/hospitalController';

const router = Router();

router.get('/hospital/:id', authMiddleware, getHospitalById);



router.get('/hospitals', authMiddleware, getAllHospitals);

export default router;
