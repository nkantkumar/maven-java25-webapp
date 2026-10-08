import React from 'react';
import { useSelector } from 'react-redux';
import { Cpu, HardDrive, Zap, Server } from 'lucide-react';

export default function JvmDiagnosticsCard() {
  const { data, loading, error, lastUpdated } = useSelector((state) => state.jvm);

  if (loading && !data) {
    return (
      <div className="card hero-card col-6">
        <div className="card-header">
          <h2><Zap size={20} color="var(--primary-cyan)" /> Java 25 Runtime Diagnostics</h2>
        </div>
        <div className="card-body" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading JVM diagnostics data via RxJS stream...
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="card hero-card col-6">
        <div className="card-header">
          <h2><Zap size={20} color="var(--accent-red)" /> Java 25 Runtime Diagnostics</h2>
        </div>
        <div className="card-body" style={{ padding: '1.5rem', color: 'var(--accent-red)' }}>
          Error loading JVM diagnostics: {error}
        </div>
      </div>
    );
  }

  const {
    javaVersion,
    javaVendor,
    osName,
    osArch,
    availableProcessors,
    usedMemoryMb,
    totalMemoryMb,
    maxMemoryMb,
    isVirtualThreadSupportActive,
    activeGarbageCollectors,
  } = data || {};

  const memoryPct = totalMemoryMb > 0 ? Math.round((usedMemoryMb / totalMemoryMb) * 100) : 0;

  return (
    <div className="card hero-card col-6">
      <div className="card-header">
        <h2>
          <Zap size={20} color="var(--primary-cyan)" /> Java 25 Runtime Diagnostics
        </h2>
        <span className="badge badge-purple">{javaVendor || 'OpenJDK'} {javaVersion || '25'}</span>
      </div>

      <div className="card-body">
        <div className="metrics-grid">
          <div className="metric-box">
            <span className="metric-label">Java Version</span>
            <span className="metric-value highlight-cyan">{javaVersion}</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">Architecture</span>
            <span className="metric-value">{osArch} ({osName})</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">CPU Cores</span>
            <span className="metric-value">{availableProcessors} Cores</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">Virtual Threads</span>
            <span className="metric-value highlight-green">
              {isVirtualThreadSupportActive ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>

        {/* Memory Bar */}
        <div className="memory-container">
          <div className="memory-header">
            <span>Heap Memory Usage</span>
            <span>{usedMemoryMb} MB / {totalMemoryMb} MB ({memoryPct}%)</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${memoryPct}%` }}></div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Active GC:</span>
            {activeGarbageCollectors && activeGarbageCollectors.length > 0 ? (
              activeGarbageCollectors.map((gc, i) => (
                <span key={i} className="badge badge-blue" style={{ fontSize: '0.7rem' }}>
                  {gc}
                </span>
              ))
            ) : (
              <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>Standard GC</span>
            )}
          </div>
          {lastUpdated && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              Last Sync: {lastUpdated}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
