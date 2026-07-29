import { useState, useEffect } from 'react';
import './index.css';
import { isLoggedIn, getAdminStats } from './api';
import LoginPage from './pages/LoginPage';
import AdminLayout from './components/AdminLayout';
import OverviewPage from './pages/OverviewPage';
import UsersPage from './pages/UsersPage';
import AIUsagePage from './pages/AIUsagePage';
import DocumentsPage from './pages/DocumentsPage';

type Page = 'overview' | 'users' | 'ai' | 'documents';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [currentPage, setCurrentPage] = useState<Page>('overview');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loggedIn) return;
    setLoading(true);
    setError('');
    getAdminStats()
      .then(setData)
      .catch(err => setError(err.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  }, [loggedIn]);

  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />;
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
      onLogout={() => setLoggedIn(false)}
    >
      {renderPage()}
    </AdminLayout>
  );
}
