const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {
    loginController,
    registerController,
    authController,
    applyDoctorController,
    getAllNotificationController,
    deleteAllNotificationController,
    getAllDoctorsController,
    bookAppointmentController,
    bookingAvailabilityController,
    userAppointmentsController
} = require('../controllers/userCtrl');

const router = express.Router();

// LOGIN || POST
router.post('/login', loginController);

// REGISTER || POST
router.post('/register', registerController);

// AUTH || POST
router.post('/getUserData', authMiddleware, authController);

// APPLY DOCTOR || POST
router.post('/apply-doctor', authMiddleware, applyDoctorController);

// GET ALL NOTIFICATIONS || POST
router.post('/get-all-notification', authMiddleware, getAllNotificationController);

// DELETE ALL NOTIFICATIONS || POST
router.post('/delete-all-notification', authMiddleware, deleteAllNotificationController);

// GET ALL DOCTORS || GET
router.get('/getAllDoctors', authMiddleware, getAllDoctorsController);

// BOOK APPOINTMENT || POST
router.post('/book-appointment', authMiddleware, bookAppointmentController);

// BOOKING AVAILABILITY || POST
router.post('/booking-availability', authMiddleware, bookingAvailabilityController);

// USER APPOINTMENTS || GET
router.get('/user-appointments', authMiddleware, userAppointmentsController);

module.exports = router;
