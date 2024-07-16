const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({

  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  doctorInfo: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  userInfo: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: "pending"
  },
  time: {
    type: String,
    required: true
  }
}, { timestamps: true });

const appointmentModel = mongoose.model('appointments', appointmentSchema);

module.exports = appointmentModel;
