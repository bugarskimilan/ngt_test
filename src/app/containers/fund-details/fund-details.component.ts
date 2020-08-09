import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { FundsState, ListItemModel } from 'src/app/store';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-fund-details',
  templateUrl: './fund-details.component.html',
  styleUrls: ['./fund-details.component.scss'],
})
export class FundDetailsComponent implements OnInit {
  subfundlist: Observable<ListItemModel[]>;

  constructor(
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.subfundlist = store.select(
      FundsState.subfundList(activatedRoute.snapshot.params.fundid)
    );
  }

  ngOnInit(): void {}

  goback() {
    this.router.navigate([`funds`]);
  }

  goToDetails(subfundid: string) {
    this.router.navigate([
      `funds/${this.activatedRoute.snapshot.params.fundid}/${subfundid}`,
    ]);
  }
}
