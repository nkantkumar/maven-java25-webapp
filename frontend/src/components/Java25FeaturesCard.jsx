import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab, setSearchQuery } from '../store/featuresSlice';
import { Sparkles, Code, CheckCircle, Search } from 'lucide-react';

export default function Java25FeaturesCard() {
  const dispatch = useDispatch();
  const { items, activeTab, searchQuery, loading, error } = useSelector(
    (state) => state.features
  );

  if (loading && items.length === 0) {
    return (
      <div className="card full-width col-12">
        <div className="card-header">
          <h2><Sparkles size={20} color="var(--primary-purple)" /> Java 25 Language Features</h2>
        </div>
        <div className="card-body" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading Java 25 features via RxJS stream...
        </div>
      </div>
    );
  }

  const filteredItems = items.filter(
    (f) =>
      f.featureName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedFeature = filteredItems[activeTab] || filteredItems[0] || items[0];

  return (
    <div className="card full-width col-12">
      <div className="card-header">
        <h2>
          <Sparkles size={20} color="var(--primary-purple)" /> Java 25 Language Features Inspector
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="form-control"
              style={{ paddingLeft: '2rem', fontSize: '0.8rem', width: '180px' }}
            />
            <Search
              size={14}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>
          <span className="badge badge-blue">Interactive Inspector</span>
        </div>
      </div>

      <div className="card-body">
        {filteredItems.length > 0 && (
          <div className="features-tabs">
            {filteredItems.map((f, idx) => (
              <button
                key={idx}
                className={`tab-btn ${idx === activeTab ? 'active' : ''}`}
                onClick={() => dispatch(setActiveTab(idx))}
              >
                {f.featureName.split('(')[0]}
              </button>
            ))}
          </div>
        )}

        {selectedFeature ? (
          <div className="feature-detail-grid" style={{ marginTop: '1rem' }}>
            <div className="feature-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>{selectedFeature.featureName}</h3>
                <span className="badge badge-purple">{selectedFeature.javaVersionIntroducedOrStandard}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{selectedFeature.description}</p>

              <div className="eval-box">
                <div className="eval-title">
                  <CheckCircle size={14} style={{ display: 'inline', marginRight: '0.3rem' }} />
                  Live Java 25 Runtime Evaluation Result:
                </div>
                <div className="eval-val">{selectedFeature.evaluationResult}</div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                <Code size={14} style={{ display: 'inline', marginRight: '0.3rem' }} />
                Code Implementation:
              </div>
              <div className="code-terminal" style={{ maxHeight: '280px' }}>
                <pre><code>{selectedFeature.codeSnippet}</code></pre>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
            No features found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
}
