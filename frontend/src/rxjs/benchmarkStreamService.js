import { Subject, from, of } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { startBenchmark, setBenchmarkResult, setBenchmarkError } from '../store/benchmarkSlice';
import { addStreamEvent } from '../store/reactiveSlice';
import { manualRefresh$ } from './jvmStreamService';

export const runBenchmarkTrigger$ = new Subject();

export function setupBenchmarkStream(dispatch) {
  const subscription = runBenchmarkTrigger$
    .pipe(
      tap(({ taskCount, delayMs }) => {
        dispatch(startBenchmark());
        dispatch(
          addStreamEvent({
            type: 'RxJS [Benchmark Triggered]',
            detail: `Tasks: ${taskCount} | Simulated Delay: ${delayMs}ms`,
          })
        );
      }),
      switchMap(({ taskCount, delayMs }) => {
        const url = `/api/benchmark/virtual-threads?taskCount=${taskCount}&delayMs=${delayMs}`;
        return from(
          fetch(url, { method: 'POST' }).then(async (res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            return await res.json();
          })
        ).pipe(
          catchError((err) => {
            dispatch(setBenchmarkError(err.message));
            dispatch(addStreamEvent({ type: 'RxJS [Benchmark Error]', detail: err.message }));
            return of(null);
          })
        );
      }),
      tap((result) => {
        if (result) {
          dispatch(setBenchmarkResult(result));
          dispatch(
            addStreamEvent({
              type: 'RxJS [Benchmark Completed]',
              detail: `Duration: ${result.totalDurationMs}ms | Throughput: ${result.throughputTasksPerSec} tasks/sec`,
            })
          );
          // Refresh JVM stats after benchmark completes
          manualRefresh$.next();
        }
      })
    )
    .subscribe();

  return subscription;
}
