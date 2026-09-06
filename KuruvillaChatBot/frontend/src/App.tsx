import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { ProfileSection } from './components/ProfileSection';
import { ChatSection } from './components/ChatSection';
import { StatusSection } from './components/StatusSection';
import { AdminPanel } from './components/AdminPanel';
import './App.css';

export function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<'connected' | 'disconnected'>('disconnected');

  useEffect(() => {
    // Check server health on mount
    async function checkHealth() {
      try {
        const response = await fetch('/api/health');
        if (response.ok) {
          setServerStatus('connected');
          setError(null);
        } else {
          setServerStatus('disconnected');
          setError('Server returned an error');
        }
      } catch (err) {
        setServerStatus('disconnected');
        setError('Unable to connect to server');
      } finally {
        setLoading(false);
      }
    }

    checkHealth();
  }, []);

  if (loading) {
    return (
      <div className="app loading">
        <div className="spinner"></div>
        <p>Initializing...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Header serverStatus={serverStatus} />
      
      <main className="main-content">
        <div className="content-wrapper">
          <div className="left-panel">
            <ProfileSection />
            <StatusSection serverStatus={serverStatus} />
          </div>
          
          <div className="right-panel">
            <ChatSection serverStatus={serverStatus} />
          </div>
        </div>
      </main>
      
      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}
      
      <AdminPanel />
    </div>
  );
}
