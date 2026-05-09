'use client'

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <div className="page-header fade-in">
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          color: 'var(--text-muted)',
          marginBottom: 8,
        }}>
          <span style={{ color: 'var(--accent-green)' }}>$</span> cat ~/about.md
        </div>
        <h1 className="page-title">About Me</h1>
        <p className="page-subtitle">Who I am & what I do</p>
      </div>

      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className="glass-card" style={{ padding: 28 }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            color: 'var(--text-muted)',
            marginBottom: 20,
            lineHeight: 1.8,
          }}>
            <div><span style={{ color: 'var(--accent-purple)' }}>const</span> <span style={{ color: 'var(--accent-cyan)' }}>profile</span> = {'{'}</div>
            <div style={{ paddingLeft: 20 }}>
              <span style={{ color: 'var(--accent-orange)' }}>name</span>: <span style={{ color: 'var(--accent-green)' }}>{'"Geek Developer"'}</span>,
            </div>
            <div style={{ paddingLeft: 20 }}>
              <span style={{ color: 'var(--accent-orange)' }}>role</span>: <span style={{ color: 'var(--accent-green)' }}>{'"Full-Stack Engineer"'}</span>,
            </div>
            <div style={{ paddingLeft: 20 }}>
              <span style={{ color: 'var(--accent-orange)' }}>location</span>: <span style={{ color: 'var(--accent-green)' }}>{'"The Internet"'}</span>,
            </div>
            <div style={{ paddingLeft: 20 }}>
              <span style={{ color: 'var(--accent-orange)' }}>loves</span>: [<span style={{ color: 'var(--accent-green)' }}>{'"Open Source"'}</span>, <span style={{ color: 'var(--accent-green)' }}>{'"Coffee"'}</span>, <span style={{ color: 'var(--accent-green)' }}>{'"Terminal"'}</span>],
            </div>
            <div>{'}'}</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: 28 }}>
          <h2 style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ color: 'var(--accent-green)' }}>$</span>
            cat skills.json
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 12,
          }}>
            {[
              { name: 'TypeScript', level: '██████████' },
              { name: 'React/Next.js', level: '██████████' },
              { name: 'Node.js', level: '████████░░' },
              { name: 'Go', level: '███████░░░' },
              { name: 'Docker', level: '████████░░' },
              { name: 'Edge Computing', level: '████████░░' },
              { name: 'System Design', level: '███████░░░' },
              { name: 'Open Source', level: '█████████░' },
            ].map(skill => (
              <div key={skill.name} style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
              }}>
                <div style={{ color: 'var(--accent-cyan)', marginBottom: 6 }}>{skill.name}</div>
                <div style={{ color: 'var(--accent-green)', letterSpacing: 2, fontSize: 11 }}>{skill.level}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ padding: 28 }}>
          <h2 style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ color: 'var(--accent-green)' }}>$</span>
            cat stack.md
          </h2>
          <div className="post-content" style={{ fontSize: 14 }}>
            <p>This blog is built with a modern edge-native stack:</p>
            <ul>
              <li><strong>Next.js 14</strong> — React framework with static export</li>
              <li><strong>EdgeOne Pages</strong> — Global edge deployment platform by Tencent Cloud</li>
              <li><strong>EdgeOne KV</strong> — Low-latency key-value storage at the edge</li>
              <li><strong>Edge Functions</strong> — Serverless API endpoints running at edge nodes</li>
            </ul>
            <p>
              The combination of static generation and edge functions provides an excellent balance of 
              performance and dynamic capability. Static pages are served from the nearest CDN node, 
              while API requests are handled by edge functions with direct KV access — all with sub-50ms latency.
            </p>
          </div>
        </div>

        <div style={{
          padding: '24px 28px',
          borderRadius: 'var(--radius-lg)',
          border: '1px dashed var(--border-primary)',
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          color: 'var(--text-muted)',
          textAlign: 'center',
          lineHeight: 2,
        }}>
          <div><span style={{ color: 'var(--accent-green)' }}>{'>'}</span> Feel free to reach out</div>
          <div style={{ color: 'var(--accent-cyan)' }}>GitHub · Twitter · Email</div>
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
            Built with 💚 and EdgeOne
          </div>
        </div>
      </div>
    </div>
  )
}