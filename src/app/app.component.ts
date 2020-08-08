import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Store } from '@ngxs/store';
import { LoadLatestFunds, FundsState } from './store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private store: Store) {
    this.store.dispatch(new LoadLatestFunds());

    this.store.select(FundsState.funds).subscribe((funds) => {
      console.log('Funds changed', funds);
    });
    this.store.select(FundsState.positionDate).subscribe((date) => {
      console.log('date changed', date);
    });
  }
}
