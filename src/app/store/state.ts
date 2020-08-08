import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { LoadLatestFunds } from './actions';
import { ImmutableContext } from '@ngxs-labs/immer-adapter';
import { AngularFireDatabase } from '@angular/fire/database';
import { tap, take } from 'rxjs/operators';
import * as moment from 'moment';

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
      st.loaded = false;
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

  @Selector()
  public static funds(state: FundsStateModel) {
    return state.funds;
  }
  @Selector()
  public static positionDate(state: FundsStateModel) {
    return state.positionDate;
  }

  @Selector()
  public static amelia_brown_fund(state: FundsStateModel) {
    return state.funds.amelia_brown_fund;
  }
}
