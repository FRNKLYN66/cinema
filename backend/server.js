require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
app.use(cors());           // lets the HTML page call the API
app.use(express.json());   // lets us read JSON request bodies

// Serve the frontend too (so one link works after deployment)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// GET all
app.get('/api/showtimes', (req, res) => {
  const rows = db.prepare('SELECT * FROM showtimes ORDER BY id').all();
  res.json(rows);
});

// GET one
app.get('/api/showtimes/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM showtimes WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Showtime not found' });
  res.json(row);
});

// POST create
app.post('/api/showtimes', (req, res) => {
  const { movie_title, genre, cinema_hall, show_date, show_time, ticket_price, available_seats } = req.body;
  if (!movie_title) return res.status(400).json({ error: 'movie_title is required' });

  const result = db.prepare(`
    INSERT INTO showtimes (movie_title, genre, cinema_hall, show_date, show_time, ticket_price, available_seats)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(movie_title, genre, cinema_hall, show_date, show_time, ticket_price, available_seats);

  const created = db.prepare('SELECT * FROM showtimes WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(created);
});

// PUT update
app.put('/api/showtimes/:id', (req, res) => {
  const { movie_title, genre, cinema_hall, show_date, show_time, ticket_price, available_seats } = req.body;
  if (!movie_title) return res.status(400).json({ error: 'movie_title is required' });

  const result = db.prepare(`
    UPDATE showtimes
    SET movie_title = ?, genre = ?, cinema_hall = ?, show_date = ?, show_time = ?,
        ticket_price = ?, available_seats = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(movie_title, genre, cinema_hall, show_date, show_time, ticket_price, available_seats, req.params.id);

  if (result.changes === 0) return res.status(404).json({ error: 'Showtime not found' });
  res.json(db.prepare('SELECT * FROM showtimes WHERE id = ?').get(req.params.id));
});

// DELETE
app.delete('/api/showtimes/:id', (req, res) => {
  const result = db.prepare('DELETE FROM showtimes WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Showtime not found' });
  res.json({ message: 'Showtime deleted', id: Number(req.params.id) });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
