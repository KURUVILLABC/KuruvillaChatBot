import { useState, useEffect } from 'react';
import './StatusSection.css';

interface StatusSectionProps {
  serverStatus: 'connected' | 'disconnected';
}

interface SyncStatus {
  status: 'idle' | 'syncing' | 'success' | 'error';
  message: string;
  lastSync?: string;
  knowledgeVersion?: string;
}

export function StatusSection({ serverStatus }: StatusSectionProps) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    status: 'idle',
    message: 'Ready to synchronize',
  });
  const [isSyncing, setIsSyncing] = useState(false);

  // Load initial sync status
  useEffect(() => {
    fetchSyncStatus();
  }, []);

  const fetchSyncStatus = async () => {
    try {
      const response = await fetch('/api/sync/status');
      if (response.ok) {
        const data = (await response.json()) as SyncStatus;
        setSyncStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch sync status:', error);
    }
  };

  const handleSync = async () => {
    if (isSyncing || serverStatus === 'disconnected') return;

    setIsSyncing(true);
    try {
      const response = await fetch('/api/sync', { method: 'POST' });
      if (response.ok) {
        await fetchSyncStatus();
      } else {
        setSyncStatus({
          status: 'error',
          message: 'Failed to synchronize',
        });
      }
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus({
        status: 'error',
        message: 'Error during synchronization',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <section className="status-section">
      <div className="status-item">
        <label>Knowledge Base Version</label>
        <span className="status-value">{syncStatus.knowledgeVersion || 'v1.0.0'}</span>
      </div>

      <div className="status-item">
        <label>Last Synchronization</label>
        <span className="status-value">
          {syncStatus.lastSync ? new Date(syncStatus.lastSync).toLocaleString() : 'Never'}
        </span>
      </div>

      <div className="status-item">
        <label>Sync Status</label>
        <span className={`status-value ${syncStatus.status}`}>
          {syncStatus.status === 'idle' && '⏸️ Ready'}
          {syncStatus.status === 'syncing' && '⏳ Syncing'}
          {syncStatus.status === 'success' && '✅ Success'}
          {syncStatus.status === 'error' && '❌ Error'}
        </span>
      </div>

      <div className="status-item">
        <label>Connection Status</label>
        <span className={`status-value ${serverStatus}`}>
          {serverStatus === 'connected' ? '🟢 Connected' : '🔴 Offline'}
        </span>
      </div>

      <div className="status-item">
        <label>Mode</label>
        <span className="status-value mock">🧪 Mock/Development</span>
      </div>

      <button
        className="sync-button"
        onClick={handleSync}
        disabled={isSyncing || serverStatus === 'disconnected'}
      >
        {isSyncing ? '⏳ Syncing...' : '🔄 Synchronize Now'}
      </button>
    </section>
  );
}
