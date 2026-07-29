import type { ReactNode } from 'react';
import { LayoutDashboard, Users, Bot, FileText, LogOut, GraduationCap } from 'lucide-react';
import { logout } from '../api';

type Page = 'overview' | 'users' | 'ai' | 'documents';

interface Props {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  children: ReactNode;
}

const navItems: { id: Page; label: string; icon: ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard /> },
  { id: 'users', label: 'Users', icon: <Users /> },
  { id: 'ai', label: 'AI Usage', icon: <Bot /> },
  { id: 'documents', label: 'Documents', icon: <FileText /> },
];

export default function AdminLayout({ currentPage, onNavigate, onLogout, children }: Props) {
  function handleLogout() {
    logout();
    onLogout();
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap style={{ width: 16, height: 16, color: 'white' }} />
            </div>
            <h1>BUK Scholar AI</h1>
          </div>
          <p>Admin Dashboard <span className="sidebar-badge">Admin</span></p>
        </div>

        <div className="nav-section">
          <div className="nav-label">Main Menu</div>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item${currentPage === item.id ? ' active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut style={{ width: 15, height: 15 }} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="page-container">
          {children}
        </div>
      </main>
    </div>
  );
}
