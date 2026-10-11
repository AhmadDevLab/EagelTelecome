import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { authHeaders } from '../lib/api'
import { US_STATES } from '../lib/states'
import '../admin.css'

const TOKEN_KEY = 'eagle_admin_token'

const EMPTY_FILTERS = {
  q: '',
  state: '',
  consent: '',
  has_cert: '',
  from: '',
  to: '',
}

// "https://cert.trustedform.com/<id>" -> "<id>"
function certId(url) {
  return url.split('?')[0].replace(/\/+$/, '').split('/').pop()
}

function CopyButton({ value, label = 'Copy' }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy(e) {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      const el = document.createElement('textarea')
      el.value = value
      el.style.position = 'fixed'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <button
      type="button"
      className="ad-copy"
      onClick={handleCopy}
      title={copied ? 'Copied!' : label}
      aria-label={label}
    >
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  )
}

export default function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))

  function handleLogin(newToken) {
    localStorage.setItem(TOKEN_KEY, newToken)
    setToken(newToken)
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
  }

  return (
    <div className="ad">
      <header className="ad-header">
        <Link to="/" className="ad-brand">
          <img src="/logo.jpeg" alt="Eagle Telecommunications" />
          <span>
            Etel<b>Quotes</b>
          </span>
        </Link>
        <span className="ad-tag">Admin</span>
        <div className="ad-header-actions">
          <Link to="/" className="ad-link">
            Back to site
          </Link>
          {token && <LogoutButton onLogout={handleLogout} />}
        </div>
      </header>

      <main className="ad-main">
        {token ? (
          <Dashboard onUnauthorized={handleLogout} />
        ) : (
          <AdminLogin onSuccess={handleLogin} />
        )}
      </main>
    </div>
  )
}

function LogoutButton({ onLogout }) {
  async function handleLogout() {
    try {
      await api.post('/admin/logout', {}, { headers: authHeaders() })
    } catch {
      // ignore network errors on logout
    }
    onLogout()
  }

  return (
    <button type="button" className="ad-btn ad-btn-ghost ad-btn-sm" onClick={handleLogout}>
      Log out
    </button>
  )
}

function AdminLogin({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/admin/login', { password })
      onSuccess(res.data.token)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="ad-card ad-login" onSubmit={handleSubmit}>
      <h1>Admin sign in</h1>
      <p className="ad-muted">Enter the admin password to view submissions.</p>

      {error && <div className="ad-alert">{error}</div>}

      <div className="ad-field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
      </div>

      <button className="ad-btn ad-btn-gold" type="submit" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}

function Dashboard({ onUnauthorized }) {
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [applied, setApplied] = useState(EMPTY_FILTERS)
  const [page, setPage] = useState(1)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(
    async (f, p) => {
      setLoading(true)
      setError('')
      const params = { page: p }
      Object.entries(f).forEach(([k, v]) => {
        if (v !== '') params[k] = v
      })
      try {
        const res = await api.get('/admin/submissions', {
          headers: authHeaders(),
          params,
        })
        setResult(res.data)
      } catch (err) {
        if (err.response?.status === 401) {
          onUnauthorized()
          return
        }
        setError('Failed to load submissions.')
      } finally {
        setLoading(false)
      }
    },
    [onUnauthorized]
  )

  useEffect(() => {
    load(applied, page)
  }, [applied, page, load])

  function setFilter(key, value) {
    setFilters((f) => ({ ...f, [key]: value }))
  }

  function applyFilters(e) {
    e?.preventDefault()
    setPage(1)
    setApplied(filters)
  }

  function resetFilters() {
    setFilters(EMPTY_FILTERS)
    setPage(1)
    setApplied(EMPTY_FILTERS)
  }

  const submissions = result?.data || []
  const stats = result?.stats
  const activeCount = Object.values(applied).filter((v) => v !== '').length

  return (
    <>
      <div className="ad-title">
        <div>
          <h1>Form submissions</h1>
          <p className="ad-muted">
            Leads captured from the EtelQuotes landing page.
          </p>
        </div>
      </div>

      <section className="ad-stats">
        <Stat label="Total leads" value={stats?.total} />
        <Stat label="Today" value={stats?.today} />
        <Stat label="With consent" value={stats?.with_consent} />
        <Stat label="With TrustedForm cert" value={stats?.with_cert} />
      </section>

      <section className="ad-card">
        <form className="ad-filters" onSubmit={applyFilters}>
          <div className="ad-field ad-field-search">
            <label htmlFor="f-q">Search</label>
            <input
              id="f-q"
              placeholder="Form ID, verification code, name, email, phone, zip"
              value={filters.q}
              onChange={(e) => setFilter('q', e.target.value)}
            />
          </div>

          <div className="ad-field">
            <label htmlFor="f-state">State</label>
            <select
              id="f-state"
              value={filters.state}
              onChange={(e) => setFilter('state', e.target.value)}
            >
              <option value="">All</option>
              {US_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="ad-field">
            <label htmlFor="f-consent">Consent</label>
            <select
              id="f-consent"
              value={filters.consent}
              onChange={(e) => setFilter('consent', e.target.value)}
            >
              <option value="">All</option>
              <option value="1">Given</option>
              <option value="0">Not given</option>
            </select>
          </div>

          <div className="ad-field">
            <label htmlFor="f-cert">TrustedForm cert</label>
            <select
              id="f-cert"
              value={filters.has_cert}
              onChange={(e) => setFilter('has_cert', e.target.value)}
            >
              <option value="">All</option>
              <option value="1">Has cert</option>
              <option value="0">Missing</option>
            </select>
          </div>

          <div className="ad-field">
            <label htmlFor="f-from">From</label>
            <input
              id="f-from"
              type="date"
              value={filters.from}
              max={filters.to || undefined}
              onChange={(e) => setFilter('from', e.target.value)}
            />
          </div>

          <div className="ad-field">
            <label htmlFor="f-to">To</label>
            <input
              id="f-to"
              type="date"
              value={filters.to}
              min={filters.from || undefined}
              onChange={(e) => setFilter('to', e.target.value)}
            />
          </div>

          <div className="ad-filter-actions">
            <button className="ad-btn ad-btn-gold" type="submit">
              Apply
            </button>
            <button
              className="ad-btn ad-btn-ghost"
              type="button"
              onClick={resetFilters}
              disabled={activeCount === 0 && JSON.stringify(filters) === JSON.stringify(EMPTY_FILTERS)}
            >
              Reset
            </button>
          </div>
        </form>

        {error && <div className="ad-alert">{error}</div>}

        <div className="ad-result-line">
          {result ? (
            <span>
              <b>{result.total}</b> {result.total === 1 ? 'submission' : 'submissions'}
              {activeCount > 0 && ` · ${activeCount} filter${activeCount > 1 ? 's' : ''} active`}
            </span>
          ) : (
            <span>&nbsp;</span>
          )}
        </div>

        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Form ID</th>
                <th>Verification</th>
                <th>Name</th>
                <th>Generated email</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Zip</th>
                <th>State</th>
                <th>Consent</th>
                <th>TrustedForm ID</th>
                <th>Open form</th>
                <th>User IP</th>
                <th>User agent</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={14} className="ad-empty">
                    Loading…
                  </td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan={14} className="ad-empty">
                    No submissions match these filters.
                  </td>
                </tr>
              ) : (
                submissions.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <span className="ad-inline">
                        <span className="ad-badge ad-mono">{s.form_id}</span>
                        <CopyButton value={s.form_id} label="Copy form ID" />
                      </span>
                    </td>
                    <td className="ad-mono">{s.verification_code}</td>
                    <td className="ad-strong">
                      {s.first_name} {s.last_name}
                    </td>
                    <td className="ad-mono">{s.generated_email}</td>
                    <td className="ad-mono">{s.email || '—'}</td>
                    <td>{s.phone_number}</td>
                    <td>{s.zip_code}</td>
                    <td>{s.state || '—'}</td>
                    <td>
                      <span className={`ad-pill ${s.banana_consent ? 'is-yes' : 'is-no'}`}>
                        {s.banana_consent ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>
                      {s.trusted_form_cert_url ? (
                        <span className="ad-inline">
                          <span className="ad-mono ad-cert" title={certId(s.trusted_form_cert_url)}>
                            {certId(s.trusted_form_cert_url)}
                          </span>
                          <CopyButton
                            value={certId(s.trusted_form_cert_url)}
                            label="Copy TrustedForm ID"
                          />
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      {s.trusted_form_cert_url ? (
                        <a
                          className="ad-open"
                          href={s.trusted_form_cert_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open form
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="ad-mono">{s.ip_address || '—'}</td>
                    <td className="ad-ua" title={s.user_agent || ''}>
                      {s.user_agent || '—'}
                    </td>
                    <td>{new Date(s.submitted_at).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {result && result.last_page > 1 && (
          <div className="ad-pagination">
            <span>
              Page {result.current_page} of {result.last_page}
            </span>
            <div className="ad-pagination-btns">
              <button
                className="ad-btn ad-btn-ghost ad-btn-sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <button
                className="ad-btn ad-btn-ghost ad-btn-sm"
                disabled={page >= result.last_page}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  )
}

function Stat({ label, value }) {
  return (
    <div className="ad-stat">
      <span className="ad-stat-label">{label}</span>
      <span className="ad-stat-value">{value ?? '—'}</span>
    </div>
  )
}
