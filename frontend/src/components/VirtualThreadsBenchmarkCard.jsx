import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTaskCount, setDelayMs } from '../store/benchmarkSlice';
import { runBenchmarkTrigger$ } from '../rxjs/benchmarkStreamService';
import { Rocket, Play, Activity } from 'lucide-react';

export default function VirtualThreadsBenchmarkCard() {
  const dispatch = useDispatch();
  const { taskCount, delayMs, running, result, error, history } = useSelector(
    (state) => state.benchmark
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (running) return;
    runBenchmarkTrigger$.next({ taskCount, delayMs });
  };

  return (
    <div className="card benchmark-card col-6">
      <div className="card-header">
        <h2>
          <Rocket size={20} color="var(--accent-green)" /> Virtual Threads Benchmark
        </h2>
        <span className="badge badge-green">High Concurrency</span>
      </div>

      <div className="card-body">
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Simulate spawning thousands of lightweight concurrent tasks using Java 25 Virtual Threads
          (<code>Executors.newVirtualThreadPerTaskExecutor()</code>) driven reactively via RxJS.
        </p>

        <form onSubmit={handleSubmit} className="benchmark-form">
          <div className="form-group">
            <label htmlFor="taskCount">Concurrent Tasks</label>
            <input
              id="taskCount"
              type="number"
              className="form-control"
              value={taskCount}
              onChange={(e) => dispatch(setTaskCount(parseInt(e.target.value, 10) || 10))}
              min={10}
              max={50000}
              step={500}
              disabled={running}
            />
          </div>

          <div className="form-group">
            <label htmlFor="delayMs">Simulated I/O Delay (ms)</label>
            <input
              id="delayMs"
              type="number"
              className="form-control"
              value={delayMs}
              onChange={(e) => dispatch(setDelayMs(parseInt(e.target.value, 10) || 1))}
              min={1}
              max={1000}
              disabled={running}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={running}>
            <Play size={16} fill="currentColor" />
            <span>{running ? 'Executing...' : 'Run Benchmark'}</span>
          </button>
        </form>

        {error && (
          <div style={{ color: 'var(--accent-red)', fontSize: '0.85rem' }}>
            Benchmark Execution Error: {error}
          </div>
        )}

        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="metric-box">
                <span className="metric-label">Execution Time</span>
                <span className="metric-value highlight-cyan">{result.totalDurationMs} ms</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Throughput</span>
                <span className="metric-value highlight-magenta">
                  {result.throughputTasksPerSec?.toLocaleString()} / sec
                </span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Virtual Thread Execution Terminal Trace:
              </div>
              <div className="code-terminal">
                <div>// Benchmark Summary:</div>
                <div>// Spawns: {result.taskCount} Virtual Threads using {result.executorType}</div>
                <div>// Time: {result.totalDurationMs}ms | Simulated Delay: {result.simulatedDelayPerTaskMs}ms</div>
                <br />
                <div>[Sample Task Traces]:</div>
                {result.sampleTaskResults?.map((t, idx) => (
                  <div key={idx}>
                    Task #{t.taskId} | Thread: {t.threadName} | Virtual={t.isVirtual ? 'true' : 'false'} | Time={t.executionTimeMs}ms
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
