import { Router } from 'express';
import {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment
} from '../controllers/departmentController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();


router.post('/create-department', authMiddleware, createDepartment); 
router.get('/view-departments', authMiddleware, getAllDepartments); 
router.get('/:id', authMiddleware, getDepartmentById); 
router.put('/:id', authMiddleware, updateDepartment); 
router.delete('/:id', authMiddleware, deleteDepartment); 

export default router;
