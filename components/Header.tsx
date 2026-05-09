'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { href: '/', label: '~/home' },
  { href: '/posts/', label: '~/posts' },
  { href: '/about/', label: '~/about' },
  { href: '/admin/', label: '~/admin' },
]

export function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(12px)',
      background: 'rgba(10, 10, 15, 0.85)',
      borderBottom: '1px solid var(--border-primary)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
      }}>
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          textDecoration: 'none',
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--accent-green), var(--accent-cyan))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--bg-primary)',
            fontFamily: 'var(--font-mono)',
          }}>
            {'>_'}
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}>
            <span style={{ color: 'var(--accent-green)' }}>GEEK</span>
            <span style={{ color: 'var(--text-muted)' }}>.</span>
            BLOG
          </span>
        </Link>

        <nav style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: isActive ? 'var(--accent-green)' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(0, 255, 136, 0.08)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(0, 255, 136, 0.2)' : 'transparent'}`,
                  transition: 'all 0.2s ease',
                }}
              >
                {item.label}
              </Link>
            )
          })}
          <span style={{
            marginLeft: 8,
            padding: '4px 8px',
            borderRadius: '4px',
            background: 'rgba(0, 255, 136, 0.1)',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--accent-green)',
            animation: 'pulse 2s ease-in-out infinite',
          }}>
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-green)', marginRight: 6, boxShadow: '0 0 6px var(--accent-green)' }} />
            ONLINE
          </span>
        </nav>
      </div>
    </header>
  )
}