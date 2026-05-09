interface Env {
  BLOG_KV: any
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }
}

export async function onRequestPost(context: any) {
  const kv = context.env.BLOG_KV
  
  try {
    const { password } = await context.request.json()
    
    const adminConfig = await kv.get('admin:config', { type: 'json' })
    if (!adminConfig) {
      return new Response(
        JSON.stringify({ success: false, error: 'Admin not configured' }),
        { status: 401, headers: corsHeaders() }
      )
    }
    
    if (password !== adminConfig.password) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid password' }),
        { status: 401, headers: corsHeaders() }
      )
    }
    
    const token = generateToken()
    await kv.put(`session:${token}`, JSON.stringify({
      createdAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000
    }))
    
    return new Response(
      JSON.stringify({ success: true, token }),
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

function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}