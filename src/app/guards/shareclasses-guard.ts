import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { FundsState, LoadLatestFunds } from '../store';
import { Store } from '@ngxs/store';
import { tap, filter, take, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ShareclassesGuard implements CanActivate {
  constructor(private store: Store) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkStore().pipe(
      switchMap(() => {
        return this.subfundExistExists(
          route.params.fundid,
          route.params.subfundid
        );
      })
    );
  }

  private subfundExistExists(
    fundid: string,
    subfundid: string
  ): Observable<boolean> {
    return this.store.select(FundsState.funds).pipe(
      map((funds) => !!funds[fundid]?.subfunds[subfundid]),
      take(1)
    );
  }

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
