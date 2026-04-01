-- Floppybird Global Leaderboard Schema for Cloudflare D1
CREATE TABLE IF NOT EXISTS leaderboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT NOT NULL,
    country VARCHAR(2) DEFAULT 'XX',
    score INTEGER NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_score ON leaderboard(score DESC);
