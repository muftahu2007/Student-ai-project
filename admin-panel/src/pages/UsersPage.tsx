import { useState } from 'react';

interface Props { users: any[]; }

function timeAgo(iso: string | null) {
  if (!iso) return 'Never';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function UsersPage({ users }: Props) {
  const [search, setSearch] = useState('');

  const filtered = users.filter(u =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.department.toLowerCase().includes(search.toLowerCase()) ||
    u.faculty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-header">
        <h2>Users</h2>
        <p>All registered students on BUK Scholar AI.</p>
      </div>

      <div className="table-card">
        <div className="table-header">
          <h3>All Users ({users.length})</h3>
          <input
            className="search-input"
            type="text"
            placeholder="Search by name, email, department..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Faculty / Dept</th>
                <th>Level</th>
                <th>Sign Up</th>
                <th>Last Active</th>
                <th>Docs</th>
                <th>Quizzes</th>
                <th>AI Calls</th>
                <th>Auth</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No users found.
                  </td>
                </tr>
              ) : filtered.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {(user.full_name || user.username || '?')[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="user-name">{user.full_name || user.username}</div>
                        <div className="user-email">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12.5, fontWeight: 500 }}>{user.faculty || '—'}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{user.department || '—'}</div>
                  </td>
                  <td>
                    {user.level ? (
                      <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                        {user.level}
                      </span>
                    ) : '—'}
                  </td>
                  <td style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                    {new Date(user.date_joined).toLocaleDateString()}
                  </td>
                  <td style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                    {timeAgo(user.last_login)}
                  </td>
                  <td style={{ fontWeight: 600, textAlign: 'center' }}>{user.documents_uploaded}</td>
                  <td style={{ fontWeight: 600, textAlign: 'center' }}>{user.quizzes_taken}</td>
                  <td style={{ fontWeight: 600, textAlign: 'center' }}>{user.ai_interactions}</td>
                  <td>
                    <span className="badge" style={{
                      background: user.is_google ? 'var(--warning-light)' : 'var(--success-light)',
                      color: user.is_google ? 'var(--warning)' : 'var(--success)',
                    }}>
                      {user.is_google ? 'Google' : 'Email'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
