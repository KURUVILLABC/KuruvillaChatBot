import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import './StatusSection.css';
export function StatusSection({ serverStatus }) {
    const [syncStatus, setSyncStatus] = useState({
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
                const data = (await response.json());
                setSyncStatus(data);
            }
        }
        catch (error) {
            console.error('Failed to fetch sync status:', error);
        }
    };
    const handleSync = async () => {
        if (isSyncing || serverStatus === 'disconnected')
            return;
        setIsSyncing(true);
        try {
            const response = await fetch('/api/sync', { method: 'POST' });
            if (response.ok) {
                await fetchSyncStatus();
            }
            else {
                setSyncStatus({
                    status: 'error',
                    message: 'Failed to synchronize',
                });
            }
        }
        catch (error) {
            console.error('Sync error:', error);
            setSyncStatus({
                status: 'error',
                message: 'Error during synchronization',
            });
        }
        finally {
            setIsSyncing(false);
        }
    };
    return (_jsxs("section", { className: "status-section", children: [_jsxs("div", { className: "status-item", children: [_jsx("label", { children: "Knowledge Base Version" }), _jsx("span", { className: "status-value", children: syncStatus.knowledgeVersion || 'v1.0.0' })] }), _jsxs("div", { className: "status-item", children: [_jsx("label", { children: "Last Synchronization" }), _jsx("span", { className: "status-value", children: syncStatus.lastSync ? new Date(syncStatus.lastSync).toLocaleString() : 'Never' })] }), _jsxs("div", { className: "status-item", children: [_jsx("label", { children: "Sync Status" }), _jsxs("span", { className: `status-value ${syncStatus.status}`, children: [syncStatus.status === 'idle' && '⏸️ Ready', syncStatus.status === 'syncing' && '⏳ Syncing', syncStatus.status === 'success' && '✅ Success', syncStatus.status === 'error' && '❌ Error'] })] }), _jsxs("div", { className: "status-item", children: [_jsx("label", { children: "Connection Status" }), _jsx("span", { className: `status-value ${serverStatus}`, children: serverStatus === 'connected' ? '🟢 Connected' : '🔴 Offline' })] }), _jsxs("div", { className: "status-item", children: [_jsx("label", { children: "Mode" }), _jsx("span", { className: "status-value mock", children: "\uD83E\uDDEA Mock/Development" })] }), _jsx("button", { className: "sync-button", onClick: handleSync, disabled: isSyncing || serverStatus === 'disconnected', children: isSyncing ? '⏳ Syncing...' : '🔄 Synchronize Now' })] }));
}
