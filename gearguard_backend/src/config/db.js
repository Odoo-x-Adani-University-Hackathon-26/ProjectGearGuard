// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Make sure your Atlas connection string includes the database name
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;