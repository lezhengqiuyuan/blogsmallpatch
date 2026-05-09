'use client'

import { useState, useEffect } from 'react'
import { BlogPost } from '@/lib/types'
import { api, login, initAdmin, verifySession, saveToken, removeToken } from '@/lib/api'

const TAG_COLORS = ['tag', 'tag-cyan', 'tag-purple', 'tag-pink']

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

type AuthState = 'checking' | 'need-init' | 'need-login' | 'authenticated'

export default function AdminPage() {
  const [authState, setAuthState] = useState<AuthState>('checking')
  const [authPassword, setAuthPassword] = useState('')
  const [authConfirm, setAuthConfirm] = useState('')
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    summary: '',
    tags: '',
    status: 'published' as 'published' | 'draft',
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      const res = await verifySession()
      if (res.success) {
        setAuthState('authenticated')
        fetchAllPosts()
        return
      }
      localStorage.removeItem('admin_token')
    }

    try {
      const initRes = await fetch('/api/auth/init')
      const initData = await initRes.json()
      if (initData.success && initData.initialized) {
        setAuthState('need-login')
      } else {
        setAuthState('need-init')
      }
    } catch {
      setAuthState('need-login')
    }
  }

  const handleInit = async () => {
    setAuthError('')
    if (authPassword.length < 6) {
      setAuthError('Password must be at least 6 characters')
      return
    }
    if (authPassword !== authConfirm) {
      setAuthError('Passwords do not match')
      return
    }
    setAuthLoading(true)
    const res = await initAdmin(authPassword)
    if (res.success) {
      const loginRes = await login(authPassword)
      if (loginRes.success && loginRes.data) {
        saveToken(loginRes.data.token)
        setAuthState('authenticated')
        setAuthPassword('')
        setAuthConfirm('')
        fetchAllPosts()
      }
    } else {
      setAuthError(res.error || 'Init failed')
    }
    setAuthLoading(false)
  }

  const handleLogin = async () => {
    setAuthError('')
    if (!authPassword) {
      setAuthError('Please enter password')
      return
    }
    setAuthLoading(true)
    const res = await login(authPassword)
    if (res.success && res.data) {
      saveToken(res.data.token)
      setAuthState('authenticated')
      setAuthPassword('')
      fetchAllPosts()
    } else {
      setAuthError(res.error || 'Login failed')
    }
    setAuthLoading(false)
  }

  const handleLogout = () => {
    removeToken()
    setAuthState('need-login')
    setPosts([])
    setEditing(null)
    setIsCreating(false)
  }

  const fetchAllPosts = () => {
    setLoading(true)
    api.getPosts(1, 100)
      .then(data => {
        if (data.success && data.data) setPosts(data.data.posts)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const resetForm = () => {
    setForm({ title: '', slug: '', content: '', summary: '', tags: '', status: 'published' })
    setEditing(null)
    setIsCreating(false)
  }

  const handleCreate = () => {
    resetForm()
    setIsCreating(true)
  }

  const handleEdit = async (post: BlogPost) => {
    setIsCreating(false)
    const res = await api.getPost(post.slug)
    if (res.success && res.data) {
      const p = res.data
      setEditing(p)
      setForm({
        title: p.title,
        slug: p.slug,
        content: p.content,
        summary: p.summary,
        tags: p.tags.join(', '),
        status: p.status,
      })
    }
  }

  const handleSave = async () => {
    setSaving(true)
    const payload = {
      title: form.title,
      slug: form.slug || undefined,
      content: form.content,
      summary: form.summary,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      status: form.status,
    }

    try {
      if (editing) {
        await api.updatePost(editing.slug, payload)
      } else {
        await api.createPost(payload as any)
      }
      resetForm()
      fetchAllPosts()
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return
    await api.deletePost(post.slug)
    fetchAllPosts()
  }

  const isEditing = editing !== null || isCreating

  // Auth screens
  if (authState === 'checking') {
    return (
      <div style={{ maxWidth: 480, margin: '80px auto', textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 14,
          color: 'var(--text-muted)',
        }}>
          <span style={{ color: 'var(--accent-green)' }}>{'> '}</span>
          Verifying session<span style={{ opacity: 0.5 }}>...</span>
        </div>
      </div>
    )
  }

  if (authState === 'need-init') {
    return (
      <div style={{ maxWidth: 440, margin: '60px auto' }}>
        <div className="glass-card fade-in" style={{ padding: 36, border: '1px solid rgba(0, 255, 136, 0.2)' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg, var(--accent-green), var(--accent-cyan))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              margin: '0 auto 16px',
              color: 'var(--bg-primary)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
            }}>
              {'>_'}
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 8 }}>Initial Setup</h2>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>
              Set your admin password to protect the dashboard
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="input"
              type="password"
              value={authPassword}
              onChange={e => setAuthPassword(e.target.value)}
              placeholder="At least 6 characters"
              onKeyDown={e => e.key === 'Enter' && handleInit()}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              className="input"
              type="password"
              value={authConfirm}
              onChange={e => setAuthConfirm(e.target.value)}
              placeholder="Repeat password"
              onKeyDown={e => e.key === 'Enter' && handleInit()}
            />
          </div>

          {authError && (
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              color: 'var(--accent-pink)',
              marginBottom: 16,
              padding: '8px 12px',
              borderRadius: 'var(--radius)',
              background: 'rgba(255, 51, 136, 0.08)',
              border: '1px solid rgba(255, 51, 136, 0.15)',
            }}>
              <span style={{ marginRight: 6 }}>⚠</span>{authError}
            </div>
          )}

          <button
            className="btn btn-primary"
            onClick={handleInit}
            disabled={authLoading}
            style={{ width: '100%', justifyContent: 'center', opacity: authLoading ? 0.5 : 1 }}
          >
            {authLoading ? 'Initializing...' : 'Initialize Admin'}
          </button>

          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: 'var(--text-muted)',
            textAlign: 'center',
            marginTop: 16,
            lineHeight: 1.6,
          }}>
            <span style={{ color: 'var(--accent-green)' }}>{'// '}</span>
            This password protects your admin panel.<br />
            Keep it safe — you&apos;ll need it to manage posts.
          </p>
        </div>
      </div>
    )
  }

  if (authState === 'need-login') {
    return (
      <div style={{ maxWidth: 440, margin: '80px auto' }}>
        <div className="glass-card fade-in" style={{ padding: 36, border: '1px solid rgba(0, 212, 255, 0.2)' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              margin: '0 auto 16px',
              color: 'var(--bg-primary)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
            }}>
              🔒
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 8 }}>Admin Login</h2>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>
              Enter your admin password to continue
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="input"
              type="password"
              value={authPassword}
              onChange={e => setAuthPassword(e.target.value)}
              placeholder="Enter admin password"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              autoFocus
            />
          </div>

          {authError && (
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              color: 'var(--accent-pink)',
              marginBottom: 16,
              padding: '8px 12px',
              borderRadius: 'var(--radius)',
              background: 'rgba(255, 51, 136, 0.08)',
              border: '1px solid rgba(255, 51, 136, 0.15)',
            }}>
              <span style={{ marginRight: 6 }}>⚠</span>{authError}
            </div>
          )}

          <button
            className="btn btn-primary"
            onClick={handleLogin}
            disabled={authLoading}
            style={{ width: '100%', justifyContent: 'center', opacity: authLoading ? 0.5 : 1 }}
          >
            {authLoading ? 'Authenticating...' : 'Login'}
          </button>
        </div>
      </div>
    )
  }

  // Authenticated — show admin dashboard
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="page-header fade-in">
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          color: 'var(--text-muted)',
          marginBottom: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <span style={{ color: 'var(--accent-purple)' }}>root</span>
            <span style={{ color: 'var(--border-primary)' }}>@</span>
            <span style={{ color: 'var(--accent-cyan)' }}>admin</span>:
            <span style={{ color: 'var(--accent-green)' }}>~</span># dashboard
          </div>
          <button
            onClick={handleLogout}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--text-muted)',
              background: 'none',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius)',
              padding: '4px 12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--accent-pink)'; (e.target as HTMLElement).style.borderColor = 'var(--accent-pink)' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--text-muted)'; (e.target as HTMLElement).style.borderColor = 'var(--border-primary)' }}
          >
            logout →
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 className="page-title">Admin Panel</h1>
            <p className="page-subtitle">
              <span style={{ color: 'var(--accent-green)' }}>●</span> Authenticated — Manage your blog posts
            </p>
          </div>
          {!isEditing && (
            <button className="btn btn-primary" onClick={handleCreate}>
              + New Post
            </button>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="glass-card fade-in" style={{ padding: 28, marginBottom: 32, border: '1px solid rgba(0, 255, 136, 0.2)' }}>
          <h2 style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ color: 'var(--accent-green)' }}>{editing ? '✎' : '+'}</span>
            {editing ? 'Edit Post' : 'New Post'}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                className="input"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="My awesome post"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Slug (auto-generated if empty)</label>
              <input
                className="input"
                value={form.slug}
                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                placeholder="my-awesome-post"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Summary</label>
            <input
              className="input"
              value={form.summary}
              onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
              placeholder="A brief description of your post..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0 20px', alignItems: 'end' }}>
            <div className="form-group">
              <label className="form-label">Tags (comma separated)</label>
              <input
                className="input"
                value={form.tags}
                onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                placeholder="javascript, react, edgeone"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="input"
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as 'published' | 'draft' }))}
                style={{ width: 160, cursor: 'pointer' }}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Content (Markdown supported)</label>
            <textarea
              className="textarea"
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              placeholder={"# Hello World\n\nWrite your post in **Markdown**..."}
              style={{ minHeight: 360 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button className="btn" onClick={resetForm}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving || !form.title || !form.content}
              style={{ opacity: saving || !form.title || !form.content ? 0.4 : 1 }}
            >
              {saving ? 'Saving...' : editing ? 'Update Post' : 'Publish Post'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 14,
          color: 'var(--text-muted)',
          textAlign: 'center',
          padding: 80,
        }}>
          <span style={{ color: 'var(--accent-green)' }}>{'> '}</span>
          Loading posts<span style={{ opacity: 0.5 }}>...</span>
        </div>
      ) : posts.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {posts.map(post => (
            <div key={post.id} className="glass-card" style={{
              padding: '18px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 6,
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: post.status === 'published' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 204, 0, 0.1)',
                    color: post.status === 'published' ? 'var(--accent-green)' : 'var(--accent-yellow)',
                    border: `1px solid ${post.status === 'published' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 204, 0, 0.2)'}`,
                  }}>
                    {post.status}
                  </span>
                  <h3 style={{
                    fontSize: 15,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {post.title}
                  </h3>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--text-muted)',
                }}>
                  <span>{formatDate(post.createdAt)}</span>
                  <span style={{ color: 'var(--border-primary)' }}>·</span>
                  <span>{post.readTime} min</span>
                  {post.tags.length > 0 && (
                    <>
                      <span style={{ color: 'var(--border-primary)' }}>·</span>
                      {post.tags.slice(0, 3).map((tag, i) => (
                        <span key={tag} className={TAG_COLORS[i % TAG_COLORS.length]} style={{ fontSize: 11 }}>
                          {tag}
                        </span>
                      ))}
                    </>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button className="btn" onClick={() => handleEdit(post)} style={{ padding: '6px 14px', fontSize: 12 }}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(post)} style={{ padding: '6px 14px', fontSize: 12 }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <div className="empty-state-text">
            <span style={{ color: 'var(--accent-green)' }}>$ </span>
            No posts yet. Click &quot;New Post&quot; to get started.
          </div>
        </div>
      )}
    </div>
  )
}