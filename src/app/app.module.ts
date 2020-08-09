import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FundsHomeComponent } from './containers/funds-home/funds-home.component';
import { FundDetailsComponent } from './containers/fund-details/fund-details.component';
import { SubFundDetailsComponent } from './containers/sub-fund-details/sub-fund-details.component';
import { NgxsModule, NgxsModuleOptions } from '@ngxs/store';
import { FundsState } from './store';
import { DemoMaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SummaryListItemComponent } from './components/summary-list-item/summary-list-item.component';
import { MaterialElevationDirective } from './components/mat-elevation-directive/mat-elevation-directive';

export const ngxsConfig: NgxsModuleOptions = {
  developmentMode: !environment.production,
  selectorOptions: {
    injectContainerState: false,
    suppressErrors: false,
  },
};
@NgModule({
  declarations: [
    AppComponent,
    FundsHomeComponent,
    FundDetailsComponent,
    SubFundDetailsComponent,
    SummaryListItemComponent,
    MaterialElevationDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    NgxsModule.forRoot([FundsState], ngxsConfig),
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
