/**
 * Cloudflare Pages Function: GET /api/game-token
 *
 * Returns a signed HMAC token for game session verification.
 * The token binds to a random nonce and a timestamp, preventing forgery.
 * Does NOT bind to IP — WiFi/mobile network switches cause IP changes
 * between GET and POST, which would break HMAC verification.
 *
 * Anti-abuse is handled by IP rate limiting + IP dedup in leaderboard.js.
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
async function hmacSign(secret, data) {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data))
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
}

const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
}

// ---------------------------------------------------------------------------
// GET /api/game-token
// ---------------------------------------------------------------------------
export async function onRequestGet(context) {
  const { env } = context
  const secret = env.LEADERBOARD_SECRET

  if (!secret) {
    return new Response(JSON.stringify({ error: 'Server misconfigured' }), {
      status: 500,
      headers: CORS,
    })
  }

  const nonce = crypto.randomUUID()
  const ts = Date.now()
  const token = await hmacSign(secret, `${nonce}:${ts}`)

  return new Response(JSON.stringify({ nonce, ts, token }), {
    headers: {
      ...CORS,
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
    },
  })
}

// ---------------------------------------------------------------------------
// OPTIONS (CORS preflight)
// ---------------------------------------------------------------------------
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  })
}
