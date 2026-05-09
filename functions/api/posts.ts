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

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function calcReadTime(content: string): number {
  const words = content.replace(/[#*`\[\]()!]/g, '').split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  }
}

export async function onRequestGet(context: any) {
  const kv = context.env.BLOG_KV
  const url = new URL(context.request.url)
  const page = parseInt(url.searchParams.get('page') || '1')
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10')

  try {
    const indexData = await kv.get('posts:index', { type: 'json' }) || []
    const publishedPosts = indexData.filter((p: any) => p.status === 'published')
    publishedPosts.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const start = (page - 1) * pageSize
    const posts = publishedPosts.slice(start, start + pageSize)

    return new Response(
      JSON.stringify({
        success: true,
        data: { posts, total: publishedPosts.length },
      }),
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
  const headers = corsHeaders()

  if (!await verifyToken(kv, context.request)) {
    return unauthorizedResponse(headers)
  }

  try {
    const body = await context.request.json()
    const slug = body.slug || generateSlug(body.title)
    const id = generateId()
    const now = new Date().toISOString()

    const post = {
      id,
      title: body.title,
      slug,
      content: body.content,
      summary: body.summary || body.content.slice(0, 200).replace(/[#*`\n]/g, ' ').trim(),
      tags: body.tags || [],
      createdAt: now,
      updatedAt: now,
      status: body.status || 'published',
      readTime: calcReadTime(body.content),
    }

    await kv.put(`post:${slug}`, JSON.stringify(post))

    const indexData = await kv.get('posts:index', { type: 'json' }) || []
    indexData.push({
      id: post.id,
      slug: post.slug,
      title: post.title,
      summary: post.summary,
      tags: post.tags,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      status: post.status,
    })
    await kv.put('posts:index', JSON.stringify(indexData))

    return new Response(
      JSON.stringify({ success: true, data: post }),
      { status: 201, headers: corsHeaders() }
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