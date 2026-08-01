import { useState, useEffect, useCallback } from 'react';
import './index.css';
import { isLoggedIn, getAdminStats, logout, setUnauthorizedListener } from './api';
import LoginPage from './pages/LoginPage';
import AdminLayout from './components/AdminLayout';
import OverviewPage from './pages/OverviewPage';
import UsersPage from './pages/UsersPage';
import AIUsagePage from './pages/AIUsagePage';
import DocumentsPage from './pages/DocumentsPage';

type Page = 'overview' | 'users' | 'ai' | 'documents';
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

export default function App() {
  const [loggedIn, setLoggedIn] = useState(() => {
    if (!isLoggedIn()) return false;
    const last = parseInt(localStorage.getItem('admin_last_activity') || '0', 10);
    if (last > 0 && Date.now() - last > INACTIVITY_TIMEOUT_MS) {
      logout();
      return false;
    }
    return true;
  });

  const [sessionNotice, setSessionNotice] = useState<string>(() => {
    if (isLoggedIn()) {
      const last = parseInt(localStorage.getItem('admin_last_activity') || '0', 10);
      if (last > 0 && Date.now() - last > INACTIVITY_TIMEOUT_MS) {
        return "Session timed out due to inactivity (15 minutes). Please sign in again.";
      }
    }
    return "";
  });

  const [currentPage, setCurrentPage] = useState<Page>('overview');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = useCallback((noticeMsg?: string) => {
    logout();
    setLoggedIn(false);
    if (noticeMsg) {
      setSessionNotice(noticeMsg);
    }
  }, []);

  // Set up 401 / session expired listener
  useEffect(() => {
    setUnauthorizedListener(() => {
      handleLogout("Session expired or invalid. Please sign in again.");
    });
    return () => setUnauthorizedListener(null);
  }, [handleLogout]);

  // Activity tracking and inactivity timeout
  useEffect(() => {
    if (!loggedIn) return;

    const updateActivity = () => {
      localStorage.setItem('admin_last_activity', Date.now().toString());
    };

    // Track user interactions
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(evt => window.addEventListener(evt, updateActivity, { passive: true }));

    // Check for inactivity every 10 seconds
    const interval = setInterval(() => {
      const last = parseInt(localStorage.getItem('admin_last_activity') || '0', 10);
      if (last > 0 && Date.now() - last > INACTIVITY_TIMEOUT_MS) {
        handleLogout("Session timed out due to inactivity (15 minutes). Please sign in again.");
      }
    }, 10000);

    return () => {
      events.forEach(evt => window.removeEventListener(evt, updateActivity));
      clearInterval(interval);
    };
  }, [loggedIn, handleLogout]);

  // Fetch admin stats
  useEffect(() => {
    if (!loggedIn) return;
    setLoading(true);
    setError('');
    getAdminStats()
      .then(setData)
      .catch(err => {
        if (err.message && err.message.includes('Session expired')) {
          handleLogout("Session expired. Please sign in again.");
        } else {
          setError(err.message || 'Failed to load data');
        }
      })
      .finally(() => setLoading(false));
  }, [loggedIn, handleLogout]);

  if (!loggedIn) {
    return (
      <LoginPage 
        notice={sessionNotice} 
        onLogin={() => {
          setSessionNotice('');
          setLoggedIn(true);
        }} 
      />
    );
  }

  function renderPage() {
    if (loading) return <div className="loading">Loading dashboard data...</div>;
    if (error) return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--danger)' }}>
        <p style={{ fontSize: 15, fontWeight: 600 }}>⚠️ {error}</p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>
          Make sure you are logged in as a Django superuser.
        </p>
      </div>
    );
    if (!data) return null;

    switch (currentPage) {
      case 'overview': return <OverviewPage data={data} />;
      case 'users': return <UsersPage users={data.users} />;
      case 'ai': return <AIUsagePage data={data} />;
      case 'documents': return <DocumentsPage users={data.users} />;
    }
  }

  return (
    <AdminLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      onLogout={() => handleLogout()}
    >
      {renderPage()}
    </AdminLayout>
  );
}
