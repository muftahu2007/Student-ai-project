import { Users, FileText, Bot, BookOpen, TrendingUp, UserPlus } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const DONUT_COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function activityIcon(type: string) {
  const map: Record<string, { icon: React.ReactNode; bg: string; color: string }> = {
    chat: { icon: <Bot size={14} />, bg: 'var(--primary-light)', color: 'var(--primary)' },
    summary: { icon: <BookOpen size={14} />, bg: 'var(--success-light)', color: 'var(--success)' },
    quiz: { icon: <TrendingUp size={14} />, bg: 'var(--purple-light)', color: 'var(--purple)' },
    study_guide: { icon: <FileText size={14} />, bg: 'var(--warning-light)', color: 'var(--warning)' },
    signup: { icon: <UserPlus size={14} />, bg: 'var(--success-light)', color: 'var(--success)' },
  };
  return map[type] || map.chat;
}

function activityLabel(type: string, detail: string) {
  const labels: Record<string, string> = {
    chat: `Asked a question`,
    summary: `Generated a summary`,
    quiz: `Completed a quiz`,
    study_guide: `Generated a study guide`,
    signup: `Joined BUK Scholar AI`,
    flashcards: `Generated flashcards`,
  };
  const label = labels[type] || type;
  return detail ? `${label} · ${detail}` : label;
}

interface Props { data: any; }

export default function OverviewPage({ data }: Props) {
  const { stats, signups_by_month, ai_by_day, feature_usage, activity_feed } = data;

  const statCards = [
    { label: 'Total Users', value: stats.total_users, badge: `+${stats.new_users_this_week} this week`, badgeColor: 'var(--success)', badgeBg: 'var(--success-light)', icon: <Users />, iconBg: 'var(--primary-light)', iconColor: 'var(--primary)' },
    { label: 'Documents Uploaded', value: stats.total_documents, icon: <FileText />, iconBg: 'var(--warning-light)', iconColor: 'var(--warning)' },
    { label: 'Total AI Calls', value: stats.total_ai_calls, icon: <Bot />, iconBg: 'var(--purple-light)', iconColor: 'var(--purple)' },
    { label: 'Quizzes Generated', value: stats.total_quizzes, icon: <TrendingUp />, iconBg: 'var(--success-light)', iconColor: 'var(--success)' },
  ];

  return (
    <>
      <div className="page-header">
        <h2>Overview</h2>
        <p>All key metrics for BUK Scholar AI at a glance.</p>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid">
        {statCards.map((card, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-card-top">
              <div className="stat-icon" style={{ background: card.iconBg, color: card.iconColor }}>
                {card.icon}
              </div>
              {card.badge && (
                <span className="stat-badge" style={{ background: card.badgeBg, color: card.badgeColor }}>
                  {card.badge}
                </span>
              )}
            </div>
            <div className="stat-value">{card.value}</div>
            <div className="stat-label">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-title">User Signups — Last 6 Months</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={signups_by_month} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="signups" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Signups" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-title">Feature Usage Breakdown</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={feature_usage} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {feature_usage.map((_: any, index: number) => (
                  <Cell key={index} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="bottom-row">
        {/* Activity Feed */}
        <div className="activity-feed">
          <div className="chart-title">Recent Activity</div>
          {activity_feed.length === 0 ? (
            <p className="text-muted" style={{ textAlign: 'center', padding: '24px 0' }}>No activity yet.</p>
          ) : activity_feed.map((item: any, i: number) => {
            const { icon, bg, color } = activityIcon(item.type);
            return (
              <div className="activity-item" key={i}>
                <div className="activity-icon" style={{ background: bg, color }}>{icon}</div>
                <div className="activity-info">
                  <div className="activity-user">{item.user}</div>
                  <div className="activity-detail">{activityLabel(item.type, item.detail)}</div>
                </div>
                <div className="activity-time">{timeAgo(item.timestamp)}</div>
              </div>
            );
          })}
        </div>

        {/* AI Daily Usage */}
        <div className="chart-card">
          <div className="chart-title">AI Calls — Last 14 Days</div>
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
      </div>
    </>
  );
}
