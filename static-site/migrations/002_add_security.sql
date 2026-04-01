-- Migration: Add security features to leaderboard
-- Run with: npx wrangler d1 execute flybird --file=migrations/002_add_security.sql

-- 1. Add IP column to leaderboard table for per-IP dedup
ALTER TABLE leaderboard ADD COLUMN ip TEXT DEFAULT '';

-- 2. Create index on IP for faster lookups
CREATE INDEX IF NOT EXISTS idx_leaderboard_ip ON leaderboard(ip);

-- 3. Create rate_limits table for IP-based rate limiting
CREATE TABLE IF NOT EXISTS rate_limits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT NOT NULL,
  timestamp INTEGER NOT NULL
);

-- 4. Index for rate limit queries
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_ts ON rate_limits(ip, timestamp);
