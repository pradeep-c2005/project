const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const trackingRoutes = require('./routes/trackingRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tracking', trackingRoutes);

// Local MongoDB Compass connection
mongoose.connect('mongodb://127.0.0.1:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected to local Compass');
  app.listen(5000, () => console.log('🚀 Server running on port 5000'));
})
.catch(err => console.error('❌ DB Connection Error:', err));
