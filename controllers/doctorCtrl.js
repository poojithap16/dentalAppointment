const appointmentModel = require("../models/appointmentModel");
const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModels");

const getDoctorInfoController = async (req, res) => {
    try {
      const doctor = await doctorModel.findOne({ userId: req.body.userId });
      console.log(doctor); // Log the doctor data
      res.status(200).send({
        success: true,
        message: 'Doctor data fetch success',
        data: doctor,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: 'Error in Fetching Doctor Details',
      });
    }
  };
  

//update docprofile
const updateProfileController=async(req,res)=>{
    try {
       const doctor =await doctorModel.findOneAndUpdate({userId:req.body.userId},req.body) 
       res.status(201).send({
        success:true,
        message:'Doctor Profile Updated',
        data:doctor,
       })
    } catch (error) {
      console.log(error); 
      res.status(500).send({
        success:false,
        message:'Doctor Profile update issues',
        error
      }) 
    }
}

//get single doctor

const getDoctorByIdController = async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Log the entire request body
    const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
    res.status(200).send({
      success: true,
      message: "Single Doc Info Fetched",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in single doctor info',
      error,
    });
  }
};

const doctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    const appointments = await appointmentModel.find({
      doctorId: doctor._id,
    });
    res.status(200).send({
      success: true,
      message: "Doctor Appointments fetch Successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Doc Appointments",
    });
  }
};

// controller file (e.g., userController.js)
const updateStatusController = async (req, res) => {
  try {
    const { appointmentsId, status } = req.body;
    const appointment = await appointmentModel.findByIdAndUpdate(appointmentsId, { status });
    const user = await userModel.findById(appointment.userId);
    const notification = user.notification || [];

    notification.push({
      type: 'status-updated',
      message: `Your appointment status has been updated to ${status}`,
        onClickPath: '/doctor-appointments',
    });

    user.notification = notification;
    await user.save();

    res.status(200).send({
      success: true,
      message: 'Appointment Status Updated',
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: 'Error In Update Status',
    });
  }
};

module.exports = { getDoctorInfoController,updateProfileController,getDoctorByIdController,doctorAppointmentsController,updateStatusController }
