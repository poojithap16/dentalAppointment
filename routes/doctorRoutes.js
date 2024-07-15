const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { getDoctorInfoController, updateProfileController, getDoctorByIdController, doctorAppointmentsController, updateStatusController } = require('../controllers/doctorCtrl')

const router = express.Router()

// Post Single doc info
router.post('/getDoctorInfo', authMiddleware, getDoctorInfoController)

//Post update Profile
router.post('/updateProfile', authMiddleware, updateProfileController)

//Post get single doc info
router.post('/getDoctorById', authMiddleware, getDoctorByIdController)

//GET Appointments
router.get("/doctor-appointments",authMiddleware,doctorAppointmentsController);


//POST Update Status
router.post("/update-status", authMiddleware, updateStatusController);

module.exports = router
