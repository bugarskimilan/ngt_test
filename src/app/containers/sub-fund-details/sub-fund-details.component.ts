import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Shareclass, FundsState } from 'src/app/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sub-fund-details',
  templateUrl: './sub-fund-details.component.html',
  styleUrls: ['./sub-fund-details.component.scss'],
})
export class SubFundDetailsComponent implements OnInit {
  shareclasses: Observable<Shareclass[]>;
  displayedColumns = ['share_class_name', 'nb_alerts', 'report_status'];

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {
    let params = this.route.snapshot.params;

    this.shareclasses = this.store.select(
      FundsState.shareclasses(params.fundid, params.subfundid)
    );
  }

  ngOnInit(): void {}

  goback() {
    this.router.navigate([`funds/${this.route.snapshot.params.fundid}`]);
  }
}
