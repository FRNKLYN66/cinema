CREATE TABLE IF NOT EXISTS showtimes (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  movie_title     TEXT NOT NULL,
  genre           TEXT,
  cinema_hall     TEXT,
  show_date       TEXT,
  show_time       TEXT,
  ticket_price    REAL,
  available_seats INTEGER,
  created_at      TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at      TEXT DEFAULT CURRENT_TIMESTAMP
);
