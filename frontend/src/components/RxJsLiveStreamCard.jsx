import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearStreamEvents } from '../store/reactiveSlice';
import { Activity, Trash2, Radio } from 'lucide-react';

export default function RxJsLiveStreamCard() {
  const dispatch = useDispatch();
  const { streamEvents, emissionCount } = useSelector((state) => state.reactive);

  return (
    <div className="card col-12" style={{ marginTop: '0.5rem' }}>
      <div className="card-header">
        <h2>
          <Radio size={20} color="var(--primary-magenta)" /> RxJS Reactive Event Stream Log
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span className="badge badge-magenta">Emissions: {emissionCount}</span>
          <button
            className="btn btn-secondary"
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
            onClick={() => dispatch(clearStreamEvents())}
          >
            <Trash2 size={12} /> Clear Log
          </button>
        </div>
      </div>

      <div className="card-body">
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Real-time event notifications emitted by RxJS Observables (using <code>BehaviorSubject</code>, <code>Subject</code>, and <code>switchMap</code> pipelines) driving Redux state changes.
        </p>

        <div className="stream-list">
          {streamEvents.length > 0 ? (
            streamEvents.map((evt) => (
              <div key={evt.id} className="stream-item">
                <span className="stream-time">[{evt.timestamp}]</span>
                <span className="stream-event">{evt.type}</span>
                <span className="stream-detail">{evt.detail}</span>
              </div>
            ))
          ) : (
            <div style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '1rem', fontSize: '0.8rem' }}>
              Waiting for RxJS event stream emissions...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
