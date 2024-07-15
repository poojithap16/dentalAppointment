const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path=require('path')


// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize express app
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Middleware for logging HTTP requests
app.use(morgan('dev'));

// Define routes
app.use('/api/v1/user', require('./routes/userRoutes'));
app.use('/api/v1/admin', require("./routes/adminRoutes"));
app.use('/api/v1/doctor', require('./routes/doctorRoutes')); 

//static file
app.use(express.static(path.join(__dirname, './client/build')))

app.get('*', function (req,res) {
    res.sendFile(path.join(__dirname, "./client/build/index.html"))
})

// Define port from environment variables or default to 8080
const port = process.env.PORT || 8080;

// Start server and listen on the defined port
app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`.bgCyan.white);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
