import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { authHeaders } from '../lib/api'

const TOKEN_KEY = 'eagle_admin_token'

function CopyButton({ value }) {
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
      className="copy-btn"
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy'}
      aria-label="Copy form ID"
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
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">ET</span>
          Eagle Telecom
        </div>
        <span className="topbar-tag">Admin</span>
      </header>

      <main className="content">
        {token ? (
          <Dashboard onUnauthorized={handleLogout} onLogout={handleLogout} />
        ) : (
          <AdminLogin onSuccess={handleLogin} />
        )}
      </main>

      <div className="footer-note">
        <Link to="/" style={{ color: 'inherit' }}>
          Back to form
        </Link>
      </div>
    </div>
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
    <form className="card admin-login-card" onSubmit={handleSubmit}>
      <h2 className="form-title">Admin sign in</h2>
      <p className="form-subtitle">Enter the admin password to view submissions.</p>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
      </div>

      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}

function Dashboard({ onUnauthorized, onLogout }) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(
    async (q, p) => {
      setLoading(true)
      setError('')
      try {
        const res = await api.get('/admin/submissions', {
          headers: authHeaders(),
          params: { q: q || undefined, page: p },
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
    load(query, page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  function handleSearchSubmit(e) {
    e.preventDefault()
    setPage(1)
    load(query, 1)
  }

  async function handleLogout() {
    try {
      await api.post('/admin/logout', {}, { headers: authHeaders() })
    } catch {
      // ignore network errors on logout
    }
    onLogout()
  }

  const submissions = result?.data || []

  return (
    <div className="card admin-shell">
      <div className="admin-header">
        <div>
          <h1>Form submissions</h1>
          <p>Search by Form ID, verification code, name, email, phone, or zip.</p>
        </div>
        <button className="btn btn-ghost" onClick={handleLogout}>
          Log out
        </button>
      </div>

      <form className="toolbar" onSubmit={handleSearchSubmit}>
        <input
          className="search-input"
          placeholder="Search e.g. FRM-20260925-… or a name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-secondary" type="submit">
          Search
        </button>
        {query && (
          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => {
              setQuery('')
              setPage(1)
              load('', 1)
            }}
          >
            Clear
          </button>
        )}
      </form>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="table-wrap">
        <table className="submissions">
          <thead>
            <tr>
              <th>Form ID</th>
              <th>Verification</th>
              <th>Name</th>
              <th>Email</th>
              <th>Zip</th>
              <th>Phone</th>
              <th>IP Address</th>
              <th>Location</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="empty-state">
                  Loading…
                </td>
              </tr>
            ) : submissions.length === 0 ? (
              <tr>
                <td colSpan={9} className="empty-state">
                  No submissions found.
                </td>
              </tr>
            ) : (
              submissions.map((s) => (
                <tr key={s.id}>
                  <td>
                    <span className="form-id-cell">
                      <span className="badge mono">{s.form_id}</span>
                      <CopyButton value={s.form_id} />
                    </span>
                  </td>
                  <td className="mono">{s.verification_code}</td>
                  <td>
                    {s.first_name} {s.last_name}
                  </td>
                  <td className="mono">{s.generated_email}</td>
                  <td>{s.zip_code}</td>
                  <td>{s.phone_number}</td>
                  <td className="mono">{s.fake_ip_address}</td>
                  <td>{s.ip_location}</td>
                  <td>{new Date(s.submitted_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {result && result.last_page > 1 && (
        <div className="pagination">
          <span>
            Page {result.current_page} of {result.last_page} &middot; {result.total} total
          </span>
          <div className="pagination-btns">
            <button
              className="btn btn-ghost"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <button
              className="btn btn-ghost"
              disabled={page >= result.last_page}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
