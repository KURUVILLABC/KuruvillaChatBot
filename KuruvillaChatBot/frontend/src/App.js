import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { ProfileSection } from './components/ProfileSection';
import { ChatSection } from './components/ChatSection';
import { StatusSection } from './components/StatusSection';
import { AdminPanel } from './components/AdminPanel';
import './App.css';
export function App() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [serverStatus, setServerStatus] = useState('disconnected');
    useEffect(() => {
        // Check server health on mount
        async function checkHealth() {
            try {
                const response = await fetch('/api/health');
                if (response.ok) {
                    setServerStatus('connected');
                    setError(null);
                }
                else {
                    setServerStatus('disconnected');
                    setError('Server returned an error');
                }
            }
            catch (err) {
                setServerStatus('disconnected');
                setError('Unable to connect to server');
            }
            finally {
                setLoading(false);
            }
        }
        checkHealth();
    }, []);
    if (loading) {
        return (_jsxs("div", { className: "app loading", children: [_jsx("div", { className: "spinner" }), _jsx("p", { children: "Initializing..." })] }));
    }
    return (_jsxs("div", { className: "app", children: [_jsx(Header, { serverStatus: serverStatus }), _jsx("main", { className: "main-content", children: _jsxs("div", { className: "content-wrapper", children: [_jsxs("div", { className: "left-panel", children: [_jsx(ProfileSection, {}), _jsx(StatusSection, { serverStatus: serverStatus })] }), _jsx("div", { className: "right-panel", children: _jsx(ChatSection, { serverStatus: serverStatus }) })] }) }), error && (_jsx("div", { className: "error-banner", children: _jsx("p", { children: error }) })), _jsx(AdminPanel, {})] }));
}
