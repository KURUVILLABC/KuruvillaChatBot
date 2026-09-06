import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './Header.css';
export function Header({ serverStatus }) {
    return (_jsx("header", { className: "header", children: _jsxs("div", { className: "header-content", children: [_jsxs("div", { className: "header-left", children: [_jsx("h1", { className: "title", children: "Profile AI" }), _jsx("p", { className: "subtitle", children: "Professional Knowledge System" })] }), _jsx("div", { className: "header-right", children: _jsxs("div", { className: "status-indicator", children: [_jsx("span", { className: `status-dot ${serverStatus}` }), _jsx("span", { className: "status-text", children: serverStatus === 'connected' ? 'Connected' : 'Disconnected' })] }) })] }) }));
}
