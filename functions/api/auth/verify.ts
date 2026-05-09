interface Env {
  BLOG_KV: any
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  }
}

export async function onRequestGet(context: any) {
  const kv = context.env.BLOG_KV
  const token = context.request.headers.get('Authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return new Response(
      JSON.stringify({ success: false, error: 'Token required' }),
      { status: 401, headers: corsHeaders() }
    )
  }
  
  try {
    const session = await kv.get(`session:${token}`, { type: 'json' })
    if (!session || session.expiresAt < Date.now()) {
      if (session) await kv.delete(`session:${token}`)
      return new Response(
        JSON.stringify({ success: false, error: 'Session expired' }),
        { status: 401, headers: corsHeaders() }
      )
    }
    
    return new Response(
      JSON.stringify({ success: true }),
      { headers: corsHeaders() }
    )
  } catch (e: any) {
    return new Response(
      JSON.stringify({ success: false, error: e.message }),
      { status: 500, headers: corsHeaders() }
    )
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders() })
}