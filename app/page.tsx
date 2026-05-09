'use client'

import { useState, useEffect } from 'react'
import { PostCard } from '@/components/PostCard'
import { BlogPost } from '@/lib/types'

export default function HomePage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/posts?pageSize=5')
      .then(r => r.json())
      .then(data => {
        if (data.success) setPosts(data.data.posts)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <div className="fade-in" style={{ marginBottom: 56, textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          color: 'var(--text-muted)',
          marginBottom: 16,
        }}>
          <span style={{ color: 'var(--accent-green)' }}>~</span> Welcome to my terminal
        </div>
        <h1 style={{
          fontSize: '2.8rem',
          fontWeight: 700,
          lineHeight: 1.2,
          letterSpacing: '-0.03em',
          marginBottom: 16,
        }}>
          <span style={{ color: 'var(--text-primary)' }}>Hi, I&apos;m </span>
          <span style={{
            background: 'linear-gradient(135deg, var(--accent-green), var(--accent-cyan))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Geek
          </span>
        </h1>
        <p style={{
          fontSize: 16,
          color: 'var(--text-secondary)',
          maxWidth: 500,
          margin: '0 auto',
          lineHeight: 1.7,
          fontFamily: 'var(--font-mono)',
        }}>
          <span style={{ color: 'var(--accent-green)' }}>{'// '}</span>
          Exploring code, systems, and the digital frontier.{'\n'}
          Writing about tech, open source, and developer life.
        </p>
      </div>

      <div style={{ marginBottom: 40 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}>
          <h2 style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 16,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ color: 'var(--accent-green)' }}>$</span>
            ls -la ./latest-posts
          </h2>
          <a href="/posts/" style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            color: 'var(--accent-cyan)',
          }}>
            view all →
          </a>
        </div>

        {loading ? (
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
            color: 'var(--text-muted)',
            textAlign: 'center',
            padding: 60,
          }}>
            <span style={{ color: 'var(--accent-green)' }}>{'> '}</span>
            Loading posts<span style={{ opacity: 0.5 }}>...</span>
          </div>
        ) : posts.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">{'>_ '}</div>
            <div className="empty-state-text">
              <span style={{ color: 'var(--accent-green)' }}>$ </span>
              No posts yet. Go to <a href="/admin/" style={{ color: 'var(--accent-cyan)' }}>/admin</a> to create your first post.
            </div>
          </div>
        )}
      </div>

      <div style={{
        padding: '24px 28px',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border-primary)',
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        color: 'var(--text-muted)',
        lineHeight: 2,
      }}>
        <div><span style={{ color: 'var(--accent-purple)' }}>system</span><span style={{ color: 'var(--border-primary)' }}>@</span><span style={{ color: 'var(--accent-cyan)' }}>blog</span>:<span style={{ color: 'var(--accent-green)' }}>~</span>$ cat /etc/info</div>
        <div><span style={{ color: 'var(--text-secondary)' }}>Stack:</span> Next.js + EdgeOne Pages + EdgeOne KV</div>
        <div><span style={{ color: 'var(--text-secondary)' }}>Edge:</span> Global CDN, &lt;50ms latency</div>
        <div><span style={{ color: 'var(--text-secondary)' }}>Storage:</span> Edge KV - low-latency key-value store</div>
        <div><span style={{ color: 'var(--text-secondary)' }}>Theme:</span> Dark terminal / hacker aesthetic</div>
      </div>
    </div>
  )
}