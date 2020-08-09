import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Store, Select } from '@ngxs/store';
import { LoadLatestFunds, FundsState, LoadFundsForDate } from './store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @Select(FundsState.positionDate) positionDate: Observable<Date>;

  constructor(private store: Store) {}

  public onDateChanged(date: Date) {
    this.store.dispatch(new LoadFundsForDate(date));
  }
}
