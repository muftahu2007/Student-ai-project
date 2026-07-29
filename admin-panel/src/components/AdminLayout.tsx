import { useState } from 'react';
import type { ReactNode } from 'react';
import { LayoutDashboard, Users, Bot, FileText, LogOut, GraduationCap, Menu, X } from 'lucide-react';
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
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    onLogout();
  }

  function handleNav(page: Page) {
    onNavigate(page);
    setMobileOpen(false);
  }

  return (
    <div className="admin-layout">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile top bar */}
      <header className="mobile-topbar">
        <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <div className="mobile-topbar-title">
          <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap style={{ width: 14, height: 14, color: 'white' }} />
          </div>
          <span>BUK Scholar AI</span>
          <span className="sidebar-badge">Admin</span>
        </div>
        <div style={{ width: 36 }} /> {/* Spacer for centering */}
      </header>

      {/* Sidebar */}
      <aside className={`sidebar${mobileOpen ? ' sidebar-open' : ''}`}>
        <div className="sidebar-logo">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap style={{ width: 16, height: 16, color: 'white' }} />
              </div>
              <h1>BUK Scholar AI</h1>
            </div>
            <button className="sidebar-close-btn" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X size={20} />
            </button>
          </div>
          <p>Admin Dashboard <span className="sidebar-badge">Admin</span></p>
        </div>

        <div className="nav-section">
          <div className="nav-label">Main Menu</div>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item${currentPage === item.id ? ' active' : ''}`}
              onClick={() => handleNav(item.id)}
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
