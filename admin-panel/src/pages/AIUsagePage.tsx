import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];

interface Props { data: any; }

export default function AIUsagePage({ data }: Props) {
  const { stats, feature_usage, ai_by_day, users } = data;

  const topUsers = [...users]
    .sort((a, b) => b.ai_interactions - a.ai_interactions)
    .slice(0, 8);

  return (
    <>
      <div className="page-header">
        <h2>AI Usage</h2>
        <p>Detailed breakdown of how students are using the AI features.</p>
      </div>

      {/* Summary cards */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {[
          { label: 'Total AI Calls', value: stats.total_ai_calls, color: 'var(--primary)' },
          { label: 'Total Summaries', value: stats.total_summaries, color: 'var(--success)' },
          { label: 'Total Quizzes', value: stats.total_quizzes, color: 'var(--purple)' },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="charts-row">
        {/* AI by day */}
        <div className="chart-card">
          <div className="chart-title">AI Calls Per Day — Last 14 Days</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ai_by_day} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} interval={1} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="calls" fill="var(--purple)" radius={[4, 4, 0, 0]} name="AI Calls" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Feature breakdown */}
        <div className="chart-card">
          <div className="chart-title">Feature Usage Breakdown</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={feature_usage} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {feature_usage.map((_: any, index: number) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top users by AI usage */}
      <div className="table-card">
        <div className="table-header">
          <h3>Top Users by AI Usage</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Student</th>
              <th>Total AI Calls</th>
              <th>Questions Asked</th>
              <th>Summaries</th>
              <th>Quizzes</th>
            </tr>
          </thead>
          <tbody>
            {topUsers.map((user, i) => (
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
                <td><span style={{ fontWeight: 700, color: 'var(--purple)' }}>{user.ai_interactions}</span></td>
                <td>{user.questions_asked}</td>
                <td>{user.summaries_generated}</td>
                <td>{user.quizzes_taken}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
