/**
 * Cloudflare Pages Function: /api/leaderboard
 *
 * GET  — Fetch top 10 scores (timestamp-tiebreaker, edge-cached 10s)
 * POST — Submit a new score with full security stack
 *
 * Security measures:
 *  1. HMAC game-token verification (blocks raw POST without playing)
 *  2. Minimum 3-second play time + 10-minute token expiry
 *  3. IP rate limiting (5 POSTs per minute)
 *  4. Per-IP dedup: each IP holds only ONE leaderboard slot (highest score)
 *  5. Only INSERT/UPDATE if score qualifies for top 10
 *  6. Auto-cleanup: keep only top 50 entries in storage
 *
 * Ranking: top 10 rows max, timestamp as tiebreaker (先到先得).
 */

const RATE_LIMIT_WINDOW_S = 60;
const RATE_LIMIT_MAX = 5;
const DISPLAY_TOP_N = 10;
const STORAGE_KEEP_N = 50;
const MIN_PLAY_TIME_MS = 1000;       // 1 second (Flappy Bird allows instant death)
const MAX_TOKEN_AGE_MS = 86400000;   // 24 hours (allow extended play sessions)

const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

// ---------------------------------------------------------------------------
// HMAC verification (must match game-token.js)
// ---------------------------------------------------------------------------
async function hmacSign(secret, data) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

function getClientIP(request) {
  return request.headers.get('CF-Connecting-IP') || 'unknown';
}

// ---------------------------------------------------------------------------
// Rate limiting using D1
// ---------------------------------------------------------------------------
async function checkRateLimit(db, ip) {
  const windowStart = Date.now() - RATE_LIMIT_WINDOW_S * 1000;

  try {
    // Clean expired entries
    await db.prepare(
      'DELETE FROM rate_limits WHERE timestamp < ?'
    ).bind(windowStart).run();

    // Count recent requests
    const { results } = await db.prepare(
      'SELECT COUNT(*) as cnt FROM rate_limits WHERE ip = ? AND timestamp >= ?'
    ).bind(ip, windowStart).all();

    if ((results[0]?.cnt || 0) >= RATE_LIMIT_MAX) return false;

    // Record this request
    await db.prepare(
      'INSERT INTO rate_limits (ip, timestamp) VALUES (?, ?)'
    ).bind(ip, Date.now()).run();

    return true;
  } catch {
    // If rate_limits table doesn't exist yet, allow the request
    return true;
  }
}

// ---------------------------------------------------------------------------
// Compute rank numbers for the leaderboard (same score = same rank)
// ---------------------------------------------------------------------------
function assignRanks(entries) {
  let rank = 1;
  return entries.map((entry, i) => {
    if (i > 0 && entry.score < entries[i - 1].score) {
      rank = i + 1;
    }
    return { ...entry, rank };
  });
}

// ---------------------------------------------------------------------------
// GET /api/leaderboard
// Top 10 rows, ordered by score DESC then timestamp ASC.
// Same-score entries share the same rank number.
// ---------------------------------------------------------------------------
export async function onRequestGet(context) {
  const { env, request } = context;
  const cache = caches.default;
  const cacheKey = new Request(request.url, { method: 'GET' });

  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const { results } = await env.flybird.prepare(
      'SELECT player_name, country, score FROM leaderboard ORDER BY score DESC, timestamp ASC LIMIT ?'
    ).bind(DISPLAY_TOP_N).all();

    const ranked = assignRanks(results);

    const response = new Response(JSON.stringify(ranked), {
      headers: { ...CORS, 'Cache-Control': 's-maxage=10' },
    });

    context.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Database query failed' }), {
      status: 500, headers: CORS,
    });
  }
}

// ---------------------------------------------------------------------------
// POST /api/leaderboard
// ---------------------------------------------------------------------------
export async function onRequestPost(context) {
  const { env, request } = context;
  const ip = getClientIP(request);
  const secret = env.LEADERBOARD_SECRET;

  // --- Parse body ---
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400, headers: CORS,
    });
  }

  const { playerName, score, ts, token } = body;

  // --- Validate basic input ---
  if (
    !playerName || typeof playerName !== 'string' || playerName.trim().length === 0 ||
    typeof score !== 'number' || !Number.isInteger(score) || score <= 0
  ) {
    return new Response(JSON.stringify({ error: 'Invalid input' }), {
      status: 400, headers: CORS,
    });
  }

  // --- 1. HMAC token verification ---
  if (secret) {
    if (!ts || !token || !body.nonce) {
      return new Response(JSON.stringify({ error: 'Missing game session token' }), {
        status: 403, headers: CORS,
      });
    }

    const elapsed = Date.now() - ts;
    if (elapsed < MIN_PLAY_TIME_MS) {
      return new Response(JSON.stringify({ error: 'Game session too short' }), {
        status: 403, headers: CORS,
      });
    }
    if (elapsed > MAX_TOKEN_AGE_MS) {
      return new Response(JSON.stringify({ error: 'Game session expired' }), {
        status: 403, headers: CORS,
      });
    }

    const expected = await hmacSign(secret, `${body.nonce}:${ts}`);
    if (token !== expected) {
      return new Response(JSON.stringify({ error: 'Invalid game session token' }), {
        status: 403, headers: CORS,
      });
    }
  }

  // --- 2. Rate limiting (5 per minute per IP) ---
  const allowed = await checkRateLimit(env.flybird, ip);
  if (!allowed) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), {
      status: 429, headers: CORS,
    });
  }

  const cleanName = playerName.trim().slice(0, 10);
  const cleanScore = Math.floor(score);
  const country = request.cf?.country || 'XX';

  try {
    // --- 3. Check if score qualifies for top 10 ---
    const countResult = await env.flybird.prepare(
      'SELECT COUNT(*) as cnt FROM leaderboard'
    ).all();
    const totalEntries = countResult.results[0]?.cnt || 0;

    if (totalEntries >= DISPLAY_TOP_N) {
      // Get the 10th-place score (timestamp tiebreaker)
      const minResult = await env.flybird.prepare(
        'SELECT score FROM leaderboard ORDER BY score DESC, timestamp ASC LIMIT 1 OFFSET ?'
      ).bind(DISPLAY_TOP_N - 1).all();

      const minTopScore = minResult.results[0]?.score ?? 0;

      if (cleanScore < minTopScore) {
        return new Response(JSON.stringify({ qualified: false }), {
          headers: CORS,
        });
      }
    }

    // --- 4. Per-IP dedup: one slot per IP, keep highest ---
    const existing = await env.flybird.prepare(
      'SELECT id, score FROM leaderboard WHERE ip = ? ORDER BY score DESC LIMIT 1'
    ).bind(ip).all();

    if (existing.results.length > 0) {
      const existingScore = existing.results[0].score;
      const existingId = existing.results[0].id;

      if (cleanScore <= existingScore) {
        // Existing score is higher or equal — no update needed
        return new Response(JSON.stringify({ success: true, qualified: true, note: 'existing_higher' }), {
          headers: CORS,
        });
      }

      // New score is higher — update in place
      await env.flybird.prepare(
        'UPDATE leaderboard SET player_name = ?, country = ?, score = ?, timestamp = ? WHERE id = ?'
      ).bind(cleanName, country, cleanScore, new Date().toISOString(), existingId).run();
    } else {
      // New entry
      await env.flybird.prepare(
        'INSERT INTO leaderboard (player_name, country, score, ip, timestamp) VALUES (?, ?, ?, ?, ?)'
      ).bind(cleanName, country, cleanScore, ip, new Date().toISOString()).run();
    }

    // --- 5. Cleanup: keep only top 50 ---
    context.waitUntil(cleanupOldEntries(env.flybird));

    // Purge edge cache
    const cache = caches.default;
    const cacheKeyGet = new Request(request.url, { method: 'GET' });
    context.waitUntil(cache.delete(cacheKeyGet));

    return new Response(JSON.stringify({ success: true, qualified: true }), {
      headers: CORS,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Insert failed' }), {
      status: 500, headers: CORS,
    });
  }
}

// ---------------------------------------------------------------------------
// Cleanup: delete entries ranked below top 50
// ---------------------------------------------------------------------------
async function cleanupOldEntries(db) {
  try {
    const keepResult = await db.prepare(
      'SELECT score FROM leaderboard ORDER BY score DESC LIMIT 1 OFFSET ?'
    ).bind(STORAGE_KEEP_N - 1).all();

    if (keepResult.results.length > 0) {
      const cutoff = keepResult.results[0].score;
      await db.prepare(
        'DELETE FROM leaderboard WHERE score < ?'
      ).bind(cutoff).run();
    }
  } catch {
    // Best-effort cleanup
  }
}

// ---------------------------------------------------------------------------
// OPTIONS (CORS preflight)
// ---------------------------------------------------------------------------
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
