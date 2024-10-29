import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditEntryComponent } from './edit-entry/edit-entry.component';
import { ViewEntryComponent } from './view-entry/view-entry.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgxParticlesModule } from '@tsparticles/angular';



@NgModule({
  declarations: [
    DashboardComponent,
    EditEntryComponent,
    ViewEntryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgxParticlesModule
  ],
})
export class AppModule { }
