// server.js or app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/db');

// Route imports
const authRoutes = require('./src/routes/authRoutes');
const maintenanceTeamRoutes = require('./src/routes/maintenanceTeamRoutes');
const maintenanceRoutes = require('./src/routes/maintenanceRoutes');
const equipmentRoutes = require('./src/routes/equipmentRoutes');
const teamRoutes = require('./src/routes/teamRoutes');
const departmentRoutes = require('./src/routes/departmentRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
// const userRoutes = require('./src/routes/userRoutes');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/maintenance-teams', maintenanceTeamRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
// app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});