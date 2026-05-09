export function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-primary)',
      padding: '24px 0',
      marginTop: 'auto',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--text-muted)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--accent-green)' }}>{'>'}_</span>
          <span>GEEK.BLOG v1.0.0</span>
          <span style={{ color: 'var(--border-primary)' }}>|</span>
          <span>Powered by <span style={{ color: 'var(--accent-cyan)' }}>EdgeOne</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>
            <span style={{ color: 'var(--accent-green)' }}>©</span> {new Date().getFullYear()}
          </span>
          <span style={{
            padding: '2px 8px',
            borderRadius: '4px',
            background: 'rgba(0, 255, 136, 0.06)',
            border: '1px solid rgba(0, 255, 136, 0.1)',
            color: 'var(--accent-green)',
            fontSize: 11,
          }}>
            {'{ status: "running" }'}
          </span>
        </div>
      </div>
    </footer>
  )
}