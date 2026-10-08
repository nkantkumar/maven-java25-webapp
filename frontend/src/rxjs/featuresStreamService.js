import { Subject, from, of } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { setFeaturesLoading, setFeaturesData, setFeaturesError } from '../store/featuresSlice';
import { addStreamEvent } from '../store/reactiveSlice';

export const loadFeaturesTrigger$ = new Subject();

export function setupFeaturesStream(dispatch) {
  const subscription = loadFeaturesTrigger$
    .pipe(
      tap(() => {
        dispatch(setFeaturesLoading());
        dispatch(addStreamEvent({ type: 'RxJS [Load Features]', detail: 'Fetching Java 25 features' }));
      }),
      switchMap(() =>
        from(
          fetch('/api/features').then(async (res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            return await res.json();
          })
        ).pipe(
          catchError((err) => {
            dispatch(setFeaturesError(err.message));
            dispatch(addStreamEvent({ type: 'RxJS [Features Error]', detail: err.message }));
            return of([]);
          })
        )
      ),
      tap((data) => {
        dispatch(setFeaturesData(data));
        dispatch(
          addStreamEvent({
            type: 'RxJS [Features Loaded]',
            detail: `Loaded ${data.length} Java 25 feature demos`,
          })
        );
      })
    )
    .subscribe();

  return subscription;
}
