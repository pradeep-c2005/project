const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
exports.register = async (req, res) => {
  const { firstName, lastName, dob, age, study, location, email, password } = req.body;
  try {
    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    await User.create({
      firstName,
      lastName,
      dob,
      age,
      study,
      location,
      email,
      password: hashed
    });

    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'localdevsecret', // fallback for local
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.userId, req.body, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
};