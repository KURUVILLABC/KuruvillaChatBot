import './Header.css';

interface HeaderProps {
  serverStatus: 'connected' | 'disconnected';
}

export function Header({ serverStatus }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="title">Profile AI</h1>
          <p className="subtitle">Professional Knowledge System</p>
        </div>
        
        <div className="header-right">
          <div className="status-indicator">
            <span className={`status-dot ${serverStatus}`}></span>
            <span className="status-text">
              {serverStatus === 'connected' ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
