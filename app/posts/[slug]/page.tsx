'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { BlogPost } from '@/lib/types'

const codeTheme: Record<string, React.CSSProperties> = {
  'code[class*="language-"]': {
    color: '#e4e4ef',
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
  },
  'pre[class*="language-"]': {
    color: '#e4e4ef',
    background: 'transparent',
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
  },
  comment: { color: '#55556a' },
  keyword: { color: '#a855f7' },
  string: { color: '#00ff88' },
  number: { color: '#ff8844' },
  function: { color: '#00d4ff' },
  'class-name': { color: '#ffcc00' },
  operator: { color: '#ff3388' },
  punctuation: { color: '#8888a0' },
  builtin: { color: '#00d4ff' },
  property: { color: '#00d4ff' },
  tag: { color: '#ff3388' },
  'attr-name': { color: '#ffcc00' },
  'attr-value': { color: '#00ff88' },
  boolean: { color: '#ff8844' },
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const tagColors = ['tag', 'tag-cyan', 'tag-purple', 'tag-pink']

export default function PostPage() {
  const pathname = usePathname()
  const slug = pathname?.split('/').filter(Boolean).pop() || ''
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/posts/${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setPost(data.data)
        } else {
          setError(true)
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 14,
          color: 'var(--text-muted)',
          textAlign: 'center',
          padding: 100,
        }}>
          <span style={{ color: 'var(--accent-green)' }}>{'> '}</span>
          cat {slug}.md<span style={{ opacity: 0.5 }}>...</span>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-text" style={{ marginBottom: 20 }}>
            <span style={{ color: 'var(--accent-pink)' }}>ERROR: </span>
            Post &quot;{slug}&quot; not found
          </div>
          <Link href="/posts/" className="btn">
            ← Back to posts
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <nav style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        color: 'var(--text-muted)',
        marginBottom: 32,
      }}>
        <Link href="/" style={{ color: 'var(--text-muted)' }}>~</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <Link href="/posts/" style={{ color: 'var(--text-muted)' }}>posts</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: 'var(--accent-green)' }}>{post.slug}</span>
      </nav>

      <article className="fade-in">
        <header style={{ marginBottom: 40 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: 'var(--text-muted)',
            marginBottom: 16,
          }}>
            <span style={{ color: 'var(--accent-green)' }}>{'>'}</span>
            <span>{formatDate(post.createdAt)}</span>
            <span style={{ color: 'var(--border-primary)' }}>·</span>
            <span>{post.readTime} min read</span>
            <span style={{ color: 'var(--border-primary)' }}>·</span>
            <span style={{ color: 'var(--accent-cyan)' }}>{post.status}</span>
          </div>

          <h1 style={{
            fontSize: '2.2rem',
            fontWeight: 700,
            lineHeight: 1.3,
            letterSpacing: '-0.03em',
            marginBottom: 16,
          }}>
            {post.title}
          </h1>

          {post.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {post.tags.map((tag, i) => (
                <span key={tag} className={tagColors[i % tagColors.length]}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="post-content">
          <ReactMarkdown
            components={{
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                const isInline = !match
                if (!isInline) {
                  return (
                    <SyntaxHighlighter
                      style={codeTheme as any}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-primary)',
                        borderRadius: 'var(--radius)',
                        padding: '20px',
                        margin: '20px 0',
                      }}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  )
                }
                return <code className={className} {...props}>{children}</code>
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        <footer style={{
          marginTop: 48,
          paddingTop: 24,
          borderTop: '1px solid var(--border-primary)',
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Link href="/posts/" style={{ color: 'var(--text-muted)' }}>
              ← Back to posts
            </Link>
            <span style={{ color: 'var(--text-muted)' }}>
              Last updated: {formatDate(post.updatedAt)}
            </span>
          </div>
        </footer>
      </article>
    </div>
  )
}