/**
 * Cloudflare Pages Function: GET /api/game-token
 *
 * Returns a signed HMAC token for game session verification.
 * The token binds to the client IP and a timestamp, so it cannot be forged
 * or transferred between IPs. Used by POST /api/leaderboard to verify
 * that the score submission comes from an actual game session.
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

function getClientIP(request) {
  return request.headers.get('CF-Connecting-IP') || 'unknown'
}

const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
}

// ---------------------------------------------------------------------------
// GET /api/game-token
// ---------------------------------------------------------------------------
export async function onRequestGet(context) {
  const { env, request } = context
  const secret = env.LEADERBOARD_SECRET

  if (!secret) {
    return new Response(JSON.stringify({ error: 'Server misconfigured' }), {
      status: 500,
      headers: CORS,
    })
  }

  const ip = getClientIP(request)
  const ts = Date.now()
  const token = await hmacSign(secret, `${ip}:${ts}`)

  return new Response(JSON.stringify({ ts, token }), {
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
