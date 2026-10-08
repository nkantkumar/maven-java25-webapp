import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAutoRefreshInterval } from '../store/jvmSlice';
import { refreshInterval$, manualRefresh$ } from '../rxjs/jvmStreamService';
import { RefreshCw, Activity, Cpu } from 'lucide-react';

export default function Header() {
  const dispatch = useDispatch();
  const { data, loading, error, autoRefreshInterval, lastUpdated } = useSelector((state) => state.jvm);
  const { rxJsActive } = useSelector((state) => state.reactive);

  const handleRefreshClick = () => {
    manualRefresh$.next();
  };

  const handleIntervalChange = (e) => {
    const val = parseInt(e.target.value, 10);
    dispatch(setAutoRefreshInterval(val));
    refreshInterval$.next(val);
  };

  return (
    <header class="app-header">
      <div class="brand">
        <div class="logo-badge">
          <span class="java-version">25</span>
        </div>
        <div class="brand-text">
          <h1>Java 25 Maven Web Application</h1>
          <div class="subtitle">
            <span>Spring Boot 3.4</span> &bull;
            <span class="tech-tag">React 19</span>
            <span class="tech-tag">Redux Toolkit</span>
            <span class="tech-tag">RxJS 7</span>
          </div>
        </div>
      </div>

      <div class="header-controls">
        <div class={`status-pill ${error ? 'error' : ''}`}>
          <span class="dot"></span>
          <span>{error ? 'API Offline' : data ? `JVM 25 Active (${data.osName})` : 'Connecting...'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Auto Poll:</span>
          <select
            value={autoRefreshInterval}
            onChange={handleIntervalChange}
            className="form-control"
            style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
          >
            <option value={0}>Off</option>
            <option value={3000}>3s</option>
            <option value={5000}>5s</option>
            <option value={10000}>10s</option>
          </select>
        </div>

        <button className="btn btn-secondary" onClick={handleRefreshClick} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>
    </header>
  );
}
