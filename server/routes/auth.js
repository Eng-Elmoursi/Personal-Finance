const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { readDB, writeDB, generateId } = require('../db');
const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

router.post('/register', async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  const db = readDB();
  const userExists = db.users.find(u => u.email === email);
  
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = {
    _id: generateId(),
    fullName,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDB(db);

  res.status(201).json({
    _id: newUser._id,
    fullName: newUser.fullName,
    email: newUser.email,
    token: generateToken(newUser._id),
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  
  const user = db.users.find(u => u.email === email);

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

module.exports = router;
