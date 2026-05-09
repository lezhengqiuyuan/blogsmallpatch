'use client'

import Link from 'next/link'
import { BlogPost } from '@/lib/types'

const tagColors = ['tag', 'tag-cyan', 'tag-purple', 'tag-pink']

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/posts/${post.slug}/`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <article className="glass-card fade-in" style={{
        padding: '24px 28px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--text-muted)',
        }}>
          <span style={{ color: 'var(--accent-green)' }}>$</span>
          <span>{formatDate(post.createdAt)}</span>
          <span style={{ color: 'var(--border-primary)' }}>·</span>
          <span>{post.readTime} min read</span>
          {post.tags.length > 0 && (
            <>
              <span style={{ color: 'var(--border-primary)' }}>·</span>
              <span style={{ color: 'var(--accent-cyan)' }}>#{post.tags[0]}</span>
            </>
          )}
        </div>

        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
        }}>
          <span style={{ color: 'var(--accent-green)', marginRight: 8, fontFamily: 'var(--font-mono)', fontWeight: 400 }}>{'>'}</span>
          {post.title}
        </h3>

        <p style={{
          fontSize: 14,
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {post.summary}
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexWrap: 'wrap',
          marginTop: 4,
        }}>
          {post.tags.slice(0, 4).map((tag, i) => (
            <span key={tag} className={tagColors[i % tagColors.length]}>
              {tag}
            </span>
          ))}
          <span style={{
            marginLeft: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: 'var(--text-muted)',
            transition: 'color 0.2s',
          }}>
            cd {post.slug} →
          </span>
        </div>
      </article>
    </Link>
  )
}