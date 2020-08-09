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
  constructor(private store: Store) {}
}
