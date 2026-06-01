const express = require('express');
const { protect } = require('../middleware/auth');
const { readDB, writeDB, generateId } = require('../db');
const router = express.Router();

router.get('/', protect, (req, res) => {
  const db = readDB();
  const transactions = db.transactions
    .filter(t => t.userId === req.user._id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(transactions);
});

router.post('/', protect, (req, res) => {
  const { type, amount, category, description, date } = req.body;
  if (!type || !amount || !category) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const db = readDB();
  const newTx = {
    _id: generateId(),
    userId: req.user._id,
    type,
    amount,
    category,
    description,
    date: date || new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  db.transactions.push(newTx);
  writeDB(db);
  res.status(201).json(newTx);
});

router.delete('/:id', protect, (req, res) => {
  const db = readDB();
  const txIndex = db.transactions.findIndex(t => t._id === req.params.id && t.userId === req.user._id);
  
  if (txIndex === -1) return res.status(404).json({ message: 'Transaction not found or unauthorized' });

  db.transactions.splice(txIndex, 1);
  writeDB(db);
  res.json({ message: 'Transaction removed' });
});

module.exports = router;
