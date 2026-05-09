import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      fontFamily: 'var(--font-mono)',
    }}>
      <div style={{
        fontSize: '5rem',
        fontWeight: 700,
        background: 'linear-gradient(135deg, var(--accent-green), var(--accent-cyan))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        lineHeight: 1,
        marginBottom: 16,
      }}>
        404
      </div>
      <div style={{
        fontSize: 14,
        color: 'var(--text-muted)',
        marginBottom: 32,
        lineHeight: 2,
      }}>
        <div><span style={{ color: 'var(--accent-pink)' }}>ERROR</span>: Page not found</div>
        <div><span style={{ color: 'var(--accent-green)' }}>$</span> ls -la /requested/path</div>
        <div>ls: No such file or directory</div>
        <div style={{ marginTop: 8 }}>
          <span style={{ color: 'var(--accent-green)' }}>$</span> The page you are looking for does not exist.
        </div>
      </div>
      <Link href="/" className="btn btn-primary">
        cd ~/
      </Link>
    </div>
  )
}