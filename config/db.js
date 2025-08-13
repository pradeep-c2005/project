const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Replace "mydatabase" with your database name
    await mongoose.connect('mongodb://127.0.0.1:27017/mydatabase', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ MongoDB connected to local Compass');
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;