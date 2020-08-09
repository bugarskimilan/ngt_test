import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { FundsState, ListItemModel } from 'src/app/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-funds-home',
  templateUrl: './funds-home.component.html',
  styleUrls: ['./funds-home.component.scss'],
})
export class FundsHomeComponent implements OnInit {
  @Select(FundsState.fundList) fundlist: Observable<ListItemModel[]>;

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {}

  goToDetails(fundid: string) {
    console.log(fundid);
    this.router.navigate([`funds/${fundid}`]);
  }
}
