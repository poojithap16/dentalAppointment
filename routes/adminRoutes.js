const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { 
    getAllUsersController, 
    getallDoctorsController, 
    changeAccountStatusController 
} = require('../controllers/adminCtrl');

const router = express.Router();

// GET ALL USERS || GET
router.get('/getAllUsers', authMiddleware, getAllUsersController);

// GET ALL DOCTORS (ADMIN) || GET
router.get('/getAllDoctors', authMiddleware, getallDoctorsController);

// CHANGE ACCOUNT STATUS || POST
router.post('/changeAccountStatus', authMiddleware, changeAccountStatusController);

module.exports = router;
