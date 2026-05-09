interface Env {
  BLOG_KV: any
}

async function verifyToken(kv: any, request: Request): Promise<boolean> {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return false
  try {
    const session = await kv.get(`session:${token}`, { type: 'json' })
    return session && session.expiresAt > Date.now()
  } catch {
    return false
  }
}

function unauthorizedResponse(headers: Record<string, string>) {
  return new Response(
    JSON.stringify({ success: false, error: 'Unauthorized. Please login first.' }),
    { status: 401, headers }
  )
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function calcReadTime(content: string): number {
  const words = content.replace(/[#*`\[\]()!]/g, '').split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  }
}

export async function onRequestGet(context: any) {
  const { slug } = context.params
  const kv = context.env.BLOG_KV

  try {
    const data = await kv.get(`post:${slug}`, { type: 'json' })
    if (!data) {
      return new Response(
        JSON.stringify({ success: false, error: 'Post not found' }),
        { status: 404, headers: corsHeaders() }
      )
    }
    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: corsHeaders() }
    )
  } catch (e: any) {
    return new Response(
      JSON.stringify({ success: false, error: e.message }),
      { status: 500, headers: corsHeaders() }
    )
  }
}

export async function onRequestPut(context: any) {
  const { slug } = context.params
  const kv = context.env.BLOG_KV
  const headers = corsHeaders()

  if (!await verifyToken(kv, context.request)) {
    return unauthorizedResponse(headers)
  }

  try {
    const body = await context.request.json()
    const existing = await kv.get(`post:${slug}`, { type: 'json' })
    if (!existing) {
      return new Response(
        JSON.stringify({ success: false, error: 'Post not found' }),
        { status: 404, headers: corsHeaders() }
      )
    }

    const updated = {
      ...existing,
      ...body,
      id: existing.id,
      updatedAt: new Date().toISOString(),
      readTime: body.content ? calcReadTime(body.content) : existing.readTime,
    }

    if (body.slug && body.slug !== slug) {
      await kv.delete(`post:${slug}`)
      await kv.put(`post:${body.slug}`, JSON.stringify(updated))
      const indexData = await kv.get('posts:index', { type: 'json' }) || []
      const updatedIndex = indexData.map((item: any) =>
        item.id === updated.id ? { ...item, slug: body.slug, title: updated.title, summary: updated.summary, tags: updated.tags, updatedAt: updated.updatedAt, status: updated.status } : item
      )
      await kv.put('posts:index', JSON.stringify(updatedIndex))
    } else {
      await kv.put(`post:${slug}`, JSON.stringify(updated))
      const indexData = await kv.get('posts:index', { type: 'json' }) || []
      const updatedIndex = indexData.map((item: any) =>
        item.id === updated.id ? { ...item, title: updated.title, summary: updated.summary, tags: updated.tags, updatedAt: updated.updatedAt, status: updated.status } : item
      )
      await kv.put('posts:index', JSON.stringify(updatedIndex))
    }

    return new Response(
      JSON.stringify({ success: true, data: updated }),
      { headers: corsHeaders() }
    )
  } catch (e: any) {
    return new Response(
      JSON.stringify({ success: false, error: e.message }),
      { status: 500, headers: corsHeaders() }
    )
  }
}

export async function onRequestDelete(context: any) {
  const { slug } = context.params
  const kv = context.env.BLOG_KV
  const headers = corsHeaders()

  if (!await verifyToken(kv, context.request)) {
    return unauthorizedResponse(headers)
  }

  try {
    const existing = await kv.get(`post:${slug}`, { type: 'json' })
    if (!existing) {
      return new Response(
        JSON.stringify({ success: false, error: 'Post not found' }),
        { status: 404, headers: corsHeaders() }
      )
    }

    await kv.delete(`post:${slug}`)
    const indexData = await kv.get('posts:index', { type: 'json' }) || []
    const updatedIndex = indexData.filter((item: any) => item.id !== existing.id)
    await kv.put('posts:index', JSON.stringify(updatedIndex))

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