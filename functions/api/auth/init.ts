interface Env {
  BLOG_KV: any
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }
}

export async function onRequestGet(context: any) {
  const kv = context.env.BLOG_KV

  try {
    const existing = await kv.get('admin:config', { type: 'json' })
    return new Response(
      JSON.stringify({ success: true, initialized: !!existing }),
      { headers: corsHeaders() }
    )
  } catch (e: any) {
    return new Response(
      JSON.stringify({ success: false, error: e.message }),
      { status: 500, headers: corsHeaders() }
    )
  }
}

export async function onRequestPost(context: any) {
  const kv = context.env.BLOG_KV

  try {
    const existing = await kv.get('admin:config', { type: 'json' })
    if (existing) {
      return new Response(
        JSON.stringify({ success: false, error: 'Admin already configured' }),
        { status: 400, headers: corsHeaders() }
      )
    }

    const { password } = await context.request.json()
    if (!password || password.length < 6) {
      return new Response(
        JSON.stringify({ success: false, error: 'Password must be at least 6 characters' }),
        { status: 400, headers: corsHeaders() }
      )
    }

    await kv.put('admin:config', JSON.stringify({
      password,
      createdAt: new Date().toISOString(),
    }))

    return new Response(
      JSON.stringify({ success: true, message: 'Admin password configured' }),
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