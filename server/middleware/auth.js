const jwt = require('jsonwebtoken');
const { readDB } = require('../db');

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      
      const db = readDB();
      const user = db.users.find(u => u._id === decoded.id);
      
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      // Exclude password
      const { password, ...userWithoutPassword } = user;
      req.user = userWithoutPassword;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
