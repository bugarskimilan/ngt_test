import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundsHomeComponent } from './containers/funds-home/funds-home.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: FundsHomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
