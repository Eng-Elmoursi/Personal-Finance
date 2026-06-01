const fs = require('fs');
const path = require('path');

const dbDir = path.join(__dirname, 'data');
const dbPath = path.join(dbDir, 'db.json');

const initDB = () => {
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
  }
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ users: [], transactions: [], budgets: [], goals: [] }));
  }
};

const readDB = () => {
  initDB();
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
};

const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

const generateId = () => Math.random().toString(36).substr(2, 9);

module.exports = { readDB, writeDB, generateId };
