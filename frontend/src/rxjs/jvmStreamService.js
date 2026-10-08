import { BehaviorSubject, Subject, timer, of, EMPTY, merge } from 'rxjs';
import { switchMap, catchError, tap, map, filter } from 'rxjs/operators';
import { setJvmLoading, setJvmData, setJvmError } from '../store/jvmSlice';
import { addStreamEvent } from '../store/reactiveSlice';

// RxJS Subjects for dynamic reactive control
export const refreshInterval$ = new BehaviorSubject(5000); // default 5s
export const manualRefresh$ = new Subject();

export function setupJvmStream(dispatch) {
  // Manual refresh stream
  const manual$ = manualRefresh$.pipe(
    tap(() => {
      dispatch(setJvmLoading());
      dispatch(addStreamEvent({ type: 'RxJS [Manual Refresh]', detail: 'Triggered manual JVM diagnostics fetch' }));
    }),
    map(() => true)
  );

  // Auto-polling interval stream
  const auto$ = refreshInterval$.pipe(
    switchMap((intervalMs) => {
      if (!intervalMs || intervalMs <= 0) {
        dispatch(addStreamEvent({ type: 'RxJS [Poll Control]', detail: 'Auto-refresh paused' }));
        return EMPTY;
      }
      dispatch(addStreamEvent({ type: 'RxJS [Poll Control]', detail: `Auto-refresh active (${intervalMs}ms)` }));
      return timer(0, intervalMs);
    }),
    map(() => false)
  );

  // Merge manual and auto streams
  const subscription = merge(manual$, auto$)
    .pipe(
      switchMap(() => {
        return fetch('/api/jvm').then(async (res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          return await res.json();
        });
      }),
      tap((data) => {
        dispatch(setJvmData(data));
        dispatch(
          addStreamEvent({
            type: 'RxJS [Data Received]',
            detail: `Heap: ${data.usedMemoryMb}MB / ${data.totalMemoryMb}MB | Cores: ${data.availableProcessors}`,
          })
        );
      }),
      catchError((err, caught) => {
        console.error('RxJS JVM Stream Error:', err);
        dispatch(setJvmError(err.message || 'Failed to fetch JVM diagnostics'));
        dispatch(addStreamEvent({ type: 'RxJS [Stream Error]', detail: err.message }));
        return caught; // Keep stream alive on error
      })
    )
    .subscribe();

  return subscription;
}
