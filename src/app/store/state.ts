import { Injectable } from '@angular/core';
import {
  State,
  Action,
  StateContext,
  Selector,
  createSelector,
} from '@ngxs/store';
import { LoadLatestFunds, LoadFundsForDate } from './actions';
import { ImmutableContext, ImmutableSelector } from '@ngxs-labs/immer-adapter';
import { AngularFireDatabase } from '@angular/fire/database';
import { tap, take } from 'rxjs/operators';
import * as moment from 'moment';
import { state } from '@angular/animations';

export class Fund {
  fund_name: string;
  subfunds: { [subfundid: string]: SubFund };
}

export class SubFund {
  subfund_name: string;
  shareclasses: { [shareclassid: string]: Shareclass };
}

export class Shareclass {
  nb_alerts: number;
  report_status: boolean;
  share_class_name: string;
}

export interface FundsStateModel {
  positionDate: Date;
  funds: { [fundid: string]: Fund };
  loading: boolean;
  loaded: boolean;
}

export interface ListItemModel {
  id: string;
  name: string;
  alerts: number;
  finished: number;
}

@State<FundsStateModel>({
  name: 'funds',
  defaults: {
    loading: false,
    loaded: false,
    funds: {},
    positionDate: null,
  },
})
@Injectable()
export class FundsState {
  constructor(private db: AngularFireDatabase) {}

  @Action(LoadLatestFunds)
  @ImmutableContext()
  public LoadLatestFunds({ setState }: StateContext<FundsStateModel>) {
    setState((st: FundsStateModel) => {
      st.loading = true;
      return st;
    });

    return this.db
      .list('analysisDates', (ref) => ref.orderByKey().limitToLast(1))
      .snapshotChanges()
      .pipe(
        take(1),
        tap((data) => {
          setState((state: FundsStateModel) => {
            state.loaded = true;
            state.loading = false;
            state.positionDate = moment(data[0].key, 'YYYYMMDD').toDate();
            state.funds = data[0].payload.val() as { [fundid: string]: Fund };
            return state;
          });
        })
      );
  }

  @Action(LoadFundsForDate)
  @ImmutableContext()
  public LoadFundsForDate(
    { setState }: StateContext<FundsStateModel>,
    action: LoadFundsForDate
  ) {
    setState((st: FundsStateModel) => {
      st.loading = true;
      return st;
    });

    return this.db
      .object(`analysisDates/${moment(action.date).format('YYYYMMDD')}`)
      .snapshotChanges()
      .pipe(
        take(1),
        tap((data) => {
          setState((state: FundsStateModel) => {
            state.loaded = true;
            state.loading = false;
            state.positionDate = moment(data.key, 'YYYYMMDD').toDate();
            state.funds = data.payload.val() as { [fundid: string]: Fund };
            return state;
          });
        })
      );
  }

  @Selector()
  public static funds(state: FundsStateModel) {
    return state.funds;
  }
  @Selector()
  public static positionDate(state: FundsStateModel) {
    return state.positionDate;
  }

  @Selector()
  @ImmutableSelector()
  public static fundList(state: FundsStateModel): ListItemModel[] {
    return Object.entries(state.funds).map((f) => ({
      id: f[0],
      name: f[1].fund_name,
      alerts: this.sumAllFundAlerts(f[1].subfunds),
      finished: this.getpercentFinished(f[1].subfunds),
    }));
  }

  public static subfundList(fund_id: string) {
    return createSelector(
      [FundsState],
      (state: FundsStateModel): ListItemModel[] => {
        return Object.entries(state.funds[fund_id].subfunds).map((s) => ({
          id: s[0],
          name: s[1].subfund_name,
          alerts: this.sumAllSubFundAlerts(s[1].shareclasses),
          finished: this.getpercentSubFundFinished(s[1].shareclasses),
        }));
      }
    );
  }

  public static shareclasses(fundid: string, subfundid: string) {
    return createSelector([FundsState], (state: FundsStateModel) => {
      return state.funds[fundid].subfunds[subfundid].shareclasses;
    });
  }

  private static sumAllFundAlerts(subfunds: {
    [subfundid: string]: SubFund;
  }): number {
    return Object.entries(subfunds)
      .map((s) =>
        Object.entries(s[1].shareclasses).reduce(
          (a, c) => a + c[1].nb_alerts,
          0
        )
      )
      .reduce((a, c) => a + c, 0);
  }

  private static getpercentFinished(subfunds: {
    [subfundid: string]: SubFund;
  }): number {
    let finished = Object.entries(subfunds)
      .map((s) =>
        Object.entries(s[1].shareclasses).reduce(
          (a, c) => a + (c[1].report_status ? 1 : 0),
          0
        )
      )
      .reduce((a, c) => a + c, 0);

    let numberofShareclasses = Object.entries(subfunds).reduce(
      (a, c) => a + Object.entries(c[1].shareclasses).length,
      0
    );

    return finished / numberofShareclasses;
  }

  private static sumAllSubFundAlerts(shareclasses: {
    [shareclassid: string]: Shareclass;
  }): number {
    return Object.entries(shareclasses)
      .map((s) => s[1].nb_alerts)
      .reduce((a, c) => a + c, 0);
  }

  private static getpercentSubFundFinished(shareclasses: {
    [shareclassid: string]: Shareclass;
  }): number {
    let finished = Object.entries(shareclasses)
      .map((s) => (s[1].report_status ? 1 : 0))
      .reduce((a, c) => a + c, 0);

    let numberofShareclasses = Object.entries(shareclasses).length;

    return finished / numberofShareclasses;
  }
}
