const userModel = require('../models/userModels');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const doctorModel = require('../models/doctorModel');
const appointmentModel = require('../models/appointmentModel');
const moment=require('moment')

// Register callback
const registerController = async (req, res) => {
  try {
    console.log('Request received:', req.body);

    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).send({ message: 'User Already Exists', success: false });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;

    const newUser = new userModel(req.body);
    await newUser.save();

    res.status(201).send({ message: 'Register Successfully', success: true });
  } catch (error) {
    console.log('Error in registerController:', error);
    res.status(500).send({ success: false, message: `Register Controller ${error.message}` });
  }
};

// Login callback
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });// 1st we need to check the email if user doesnt exist they give the er msg
    if (!user) {
      return res.status(404).send({ message: 'User not found', success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);//if it is match then they check the pw || np |ep
    if (!isMatch) {
      return res.status(400).send({ message: " Password is incorrect", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({ message: "Login Success", success: true, data:token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error logging in",success:false,error });
  }
};

// Auth callback
const authController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({ message: 'User not found', success: false });
    } else {
      res.status(200).send({ success: true, data: user });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Auth error', success: false, error });
  }
};

// Apply doctor callback

const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = new doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification || [];
    notification.push({
      type: "Apply for doctor request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: "Doctor account applied successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while applying doctor",
    });
  }
};


// Get all notifications callback
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = notification;
    const updatedUser = await user.save();

    console.log("All notifications marked as read");

    res.status(200).send({
      success: true,
      message: "All notifications marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error in notification',
      success: false,
      error,
    });
  }
};
//delete notification
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId })
    user.notification = []
    user.seennotification = []
    const updatedUser = await user.save()
    updatedUser.password = undefined
    res.status(200).send({
      success: true,
      message: 'Notifications Deleted Successfully',
      data: updatedUser,
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'unable to delete all notification',
      error
    })
  }
}


//Get all doc
const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: 'approved' })
    res.status(200).send({
      success: true,
      message: 'Doctors lists fetching successfully',
      data: doctors,
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Fetching Doctor"
    })
  }
}




const bookAppointmentController = async (req, res) => {
  try {
      // Parse the date and time
      const date = moment(req.body.date, "DD-MM-YYYY").format('YYYY-MM-DD');
      const time = moment(req.body.time, "HH:mm").format("HH:mm");

      req.body.date = date;
      req.body.time = time;
      req.body.status = "pending";

      // Fetch user information
      const user = await userModel.findOne({ _id: req.body.userId });

      req.body.userInfo = {
          name: user.name,
          email: user.email,
      };

      const newAppointment = new appointmentModel(req.body);
      await newAppointment.save();

      const doctorUser = await userModel.findOne({ _id: req.body.doctorInfo.userId });
      doctorUser.notification.push({
          type: "New Appointment Request",
          message: `A new appointment request from ${req.body.userInfo.name}`,
          data: {
            
            onClickPath: "/doctor-appointments" // Ensure the path matches your route definition
          }
      });
      await doctorUser.save();

      res.status(200).send({
          success: true,
          message: "Appointment booked successfully.",
      });
  } catch (error) {
      res.status(500).send({
          message: "Error while booking appointment",
          success: false,
          error: error.message,
      });
  }
};


const bookingAvailabilityController = async (req, res) => {
  try {
      const date = moment(req.body.date, "DD-MM-YYYY").format('YYYY-MM-DD');
      const time = moment(req.body.time, "HH:mm").format("HH:mm");
      const fromTime = moment(time, "HH:mm").subtract(1, 'hours').format("HH:mm");
      const toTime = moment(time, "HH:mm").add(1, 'hours').format("HH:mm");
      const doctorId = req.body.doctorId;

      const appointments = await appointmentModel.find({
          doctorId,
          date,
          time: {
              $gte: fromTime,
              $lte: toTime,
          },
      });

      if (appointments.length > 0) {
          return res.status(200).send({
              message: "Appointments not available at this time",
              success: false,
          });
      } else {
          return res.status(200).send({
              success: true,
              message: "Appointments available",
          });
      }
  } catch (error) {
      res.status(500).send({
          message: "Error while checking availability",
          success: false,
          error: error.message,
      });
  }
};

const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });
    res.status(200).send({
      success: true,
      message: "Users Appointments Fetch SUccessfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In User Appointments",
    });
  }
};

module.exports = { loginController, registerController, authController, applyDoctorController, getAllNotificationController, deleteAllNotificationController, getAllDoctorsController, bookAppointmentController,bookingAvailabilityController,userAppointmentsController };
