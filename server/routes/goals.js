const express = require('express');
const { protect } = require('../middleware/auth');
const { readDB, writeDB, generateId } = require('../db');
const router = express.Router();

router.get('/', protect, (req, res) => {
  const db = readDB();
  const goals = db.goals.filter(g => g.userId === req.user._id);
  res.json(goals);
});

router.post('/', protect, (req, res) => {
  const { title, targetAmount, currentAmount } = req.body;
  
  const db = readDB();
  const goal = {
    _id: generateId(),
    userId: req.user._id,
    title,
    targetAmount,
    currentAmount: currentAmount || 0,
    createdAt: new Date().toISOString()
  };

  db.goals.push(goal);
  writeDB(db);
  res.status(201).json(goal);
});

router.delete('/:id', protect, (req, res) => {
  const db = readDB();
  const index = db.goals.findIndex(g => g._id === req.params.id && g.userId === req.user._id);
  
  if (index === -1) return res.status(404).json({ message: 'Goal not found' });

  db.goals.splice(index, 1);
  writeDB(db);
  res.json({ message: 'Goal removed' });
});

module.exports = router;
