import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditEntryComponent } from './edit-entry/edit-entry.component';
import { ViewEntryComponent } from './view-entry/view-entry.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { AdminComponent } from './admin/admin.component';

registerLocaleData(localeFr);

@NgModule({
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
  declarations: [
    DashboardComponent,
    EditEntryComponent,
    ViewEntryComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
  ],
})
export class AppModule { }
