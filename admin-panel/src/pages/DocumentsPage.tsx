interface Props { users: any[]; }

export default function DocumentsPage({ users }: Props) {
  const topUploaders = [...users]
    .sort((a, b) => b.documents_uploaded - a.documents_uploaded)
    .slice(0, 10);

  const totalDocs = users.reduce((sum, u) => sum + u.documents_uploaded, 0);

  return (
    <>
      <div className="page-header">
        <h2>Documents</h2>
        <p>Overview of all uploaded documents across users.</p>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', maxWidth: 500 }}>
        <div className="stat-card">
          <div className="stat-value">{totalDocs}</div>
          <div className="stat-label">Total Documents Uploaded</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{users.filter(u => u.documents_uploaded > 0).length}</div>
          <div className="stat-label">Students Who Uploaded</div>
        </div>
      </div>

      <div className="table-card" style={{ marginTop: 24 }}>
        <div className="table-header">
          <h3>Top Uploaders</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Student</th>
              <th>Faculty</th>
              <th>Department</th>
              <th>Documents Uploaded</th>
            </tr>
          </thead>
          <tbody>
            {topUploaders.map((user, i) => (
              <tr key={user.id}>
                <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>#{i + 1}</td>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">{(user.full_name || user.username || '?')[0].toUpperCase()}</div>
                    <div>
                      <div className="user-name">{user.full_name || user.username}</div>
                      <div className="user-email">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: 12.5 }}>{user.faculty || '—'}</td>
                <td style={{ fontSize: 12.5 }}>{user.department || '—'}</td>
                <td>
                  <span style={{ fontWeight: 700, color: 'var(--warning)', fontSize: 15 }}>
                    {user.documents_uploaded}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
