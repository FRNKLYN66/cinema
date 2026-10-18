require('dotenv').config();
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const db = new Database(process.env.DB_FILE || 'cinema.db');

// 1. Create the table if it does not exist
db.exec(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));

// 2. Insert the 10 sample records only if the table is empty
const { total } = db.prepare('SELECT COUNT(*) AS total FROM showtimes').get();
if (total === 0) {
  db.exec(fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8'));
  console.log('Sample records inserted.');
}

module.exports = db;
