const express = require('express')
const router = express.Router();
const patientController = require('../controllers/patientController')
const authMiddleware = require('../middlewares/authMiddleware')

router.post('/register-patient', authMiddleware,patientController.registerPatient);

router.get('/patients',authMiddleware, patientController.getAllPatients);

router.get('patients/:id', authMiddleware, patientController.getPatientById);

module.exports = router;
