'use client'

import { useState, useEffect } from 'react'
import { PostCard } from '@/components/PostCard'
import { BlogPost } from '@/lib/types'

export default function PostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 10

  useEffect(() => {
    setLoading(true)
    fetch(`/api/posts?page=${page}&pageSize=${pageSize}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setPosts(data.data.posts)
          setTotal(data.data.total)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <div className="page-header fade-in">
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          color: 'var(--text-muted)',
          marginBottom: 8,
        }}>
          <span style={{ color: 'var(--accent-green)' }}>$</span> find ./posts -type f -name &quot;*.md&quot; | sort -r
        </div>
        <h1 className="page-title">All Posts</h1>
        <p className="page-subtitle">
          {total > 0 ? `${total} articles found` : 'No articles yet'}
        </p>
      </div>

      {loading ? (
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 14,
          color: 'var(--text-muted)',
          textAlign: 'center',
          padding: 80,
        }}>
          <span style={{ color: 'var(--accent-green)' }}>{'> '}</span>
          Scanning files<span style={{ opacity: 0.5 }}>...</span>
        </div>
      ) : posts.length > 0 ? (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginTop: 40,
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
            }}>
              <button
                className="btn"
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                style={{ opacity: page <= 1 ? 0.3 : 1 }}
              >
                ← prev
              </button>
              <span style={{ color: 'var(--text-muted)', padding: '0 12px' }}>
                [{page}/{totalPages}]
              </span>
              <button
                className="btn"
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                style={{ opacity: page >= totalPages ? 0.3 : 1 }}
              >
                next →
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📂</div>
          <div className="empty-state-text">
            <span style={{ color: 'var(--accent-green)' }}>$ </span>
            No posts found. Create one at <a href="/admin/" style={{ color: 'var(--accent-cyan)' }}>/admin</a>
          </div>
        </div>
      )}
    </div>
  )
}