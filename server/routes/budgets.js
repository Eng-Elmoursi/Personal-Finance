const express = require('express');
const { protect } = require('../middleware/auth');
const { readDB, writeDB, generateId } = require('../db');
const router = express.Router();

router.get('/', protect, (req, res) => {
  const db = readDB();
  const budgets = db.budgets.filter(b => b.userId === req.user._id);
  res.json(budgets);
});

router.post('/', protect, (req, res) => {
  const { category, limit } = req.body;
  if (!category || limit === undefined) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const db = readDB();
  const existingIndex = db.budgets.findIndex(b => b.userId === req.user._id && b.category === category);
  
  let budget;
  if (existingIndex !== -1) {
    db.budgets[existingIndex].limit = limit;
    budget = db.budgets[existingIndex];
  } else {
    budget = {
      _id: generateId(),
      userId: req.user._id,
      category,
      limit,
      createdAt: new Date().toISOString()
    };
    db.budgets.push(budget);
  }

  writeDB(db);
  res.status(201).json(budget);
});

module.exports = router;
