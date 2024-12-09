const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING)
    console.log('Database connected to: backendDatabase');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
