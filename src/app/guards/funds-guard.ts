import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { FundsState, LoadLatestFunds } from '../store';
import { tap, filter, take, switchMap, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FundsGuard implements CanActivate {
  constructor(private store: Store) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkStore().pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  // if not initially loaded (if funds stat is null or empty basically), then load it first before loading components
  private checkStore(): Observable<boolean> {
    return this.store.select(FundsState.loaded).pipe(
      tap((loaded) => {
        if (!loaded) {
          this.store.dispatch(new LoadLatestFunds());
        }
      }),
      filter((loaded) => loaded),
      take(1)
    );
  }
}
