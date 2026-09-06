import { useState } from 'react';
import './AdminPanel.css';

export function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="admin-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Admin panel (development only)"
      >
        ⚙️
      </button>

      {isOpen && (
        <div className="admin-panel">
          <div className="admin-header">
            <h3>Admin Panel</h3>
            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="admin-content">
            <section className="admin-section">
              <h4>Profile Configuration</h4>
              <p className="section-hint">Configured via environment variables</p>
              
              <div className="config-item">
                <label>Display Name</label>
                <span>Kuruvilla</span>
              </div>
              
              <div className="config-item">
                <label>GitHub Username</label>
                <span>kuruvillaChatBot</span>
              </div>
              
              <div className="config-item">
                <label>LinkedIn URL</label>
                <span>Not configured</span>
              </div>
            </section>

            <section className="admin-section">
              <h4>Provider Status</h4>
              
              <div className="provider-status">
                <div className="provider-item">
                  <span className="provider-name">GitHub</span>
                  <span className="provider-mode">🧪 Mock</span>
                </div>
                
                <div className="provider-item">
                  <span className="provider-name">LinkedIn</span>
                  <span className="provider-mode">🧪 Mock</span>
                </div>
                
                <div className="provider-item">
                  <span className="provider-name">AI Provider</span>
                  <span className="provider-mode">🧪 Mock</span>
                </div>
              </div>
            </section>

            <section className="admin-section">
              <h4>Development Actions</h4>
              
              <button className="admin-btn">
                📊 Fetch GitHub Data
              </button>
              
              <button className="admin-btn">
                🔗 Fetch LinkedIn Data
              </button>
              
              <button className="admin-btn">
                🔄 Rebuild Knowledge Base
              </button>
              
              <button className="admin-btn danger">
                🗑️ Clear All Data
              </button>
            </section>

            <div className="admin-footer">
              <p>⚠️ Admin panel is for development only</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
