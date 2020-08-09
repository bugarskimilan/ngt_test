import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundsHomeComponent } from './containers/funds-home/funds-home.component';
import { FundDetailsComponent } from './containers/fund-details/fund-details.component';
import { SubFundDetailsComponent } from './containers/sub-fund-details/sub-fund-details.component';
import { FundsGuard, SubFundGuard, ShareclassesGuard } from './guards';

const routes: Routes = [
  { path: '', redirectTo: 'funds', pathMatch: 'full' },
  { path: 'funds', component: FundsHomeComponent, canActivate: [FundsGuard] },
  {
    path: 'funds/:fundid',
    component: FundDetailsComponent,
    canActivate: [SubFundGuard],
  },
  {
    path: 'funds/:fundid/:subfundid',
    component: SubFundDetailsComponent,
    canActivate: [ShareclassesGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
