/**
 * Cloudflare Pages Function: /api/leaderboard
 * GET  — Fetch top 10 scores (edge-cached 10s via Cache API)
 * POST — Submit a new score with auto-detected country
 */

// ---------------------------------------------------------------------------
// GET /api/leaderboard
// ---------------------------------------------------------------------------
export async function onRequestGet(context) {
  const { env, request } = context;
  const cache = caches.default;
  const cacheKey = new Request(request.url, { method: 'GET' });

  // Try edge cache first
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const { results } = await env.flybird.prepare(
      'SELECT player_name, country, score FROM leaderboard ORDER BY score DESC LIMIT 10'
    ).all();

    const response = new Response(JSON.stringify(results), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=10',
        'Access-Control-Allow-Origin': '*',
      },
    });

    // Store in edge cache (non-blocking)
    context.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Database query failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// ---------------------------------------------------------------------------
// POST /api/leaderboard
// ---------------------------------------------------------------------------
export async function onRequestPost(context) {
  const { env, request } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { playerName, score } = body;

  // Validate input
  if (
    !playerName ||
    typeof playerName !== 'string' ||
    playerName.trim().length === 0 ||
    typeof score !== 'number' ||
    score <= 0
  ) {
    return new Response(JSON.stringify({ error: 'Invalid input' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Auto-detect country from Cloudflare edge
  const country = request.cf?.country || 'XX';

  try {
    await env.flybird.prepare(
      'INSERT INTO leaderboard (player_name, country, score) VALUES (?, ?, ?)'
    ).bind(playerName.trim().slice(0, 10), country, Math.floor(score)).run();

    // Purge edge cache so next GET reflects the new score
    const cache = caches.default;
    const cacheKey = new Request(request.url, { method: 'GET' });
    context.waitUntil(cache.delete(cacheKey));

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Insert failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
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
