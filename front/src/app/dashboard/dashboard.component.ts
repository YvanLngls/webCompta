import { Component, OnInit } from '@angular/core';
import { EditEntryComponent } from '../edit-entry/edit-entry.component';
import { ViewEntryComponent } from '../view-entry/view-entry.component';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    EditEntryComponent,
    ViewEntryComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  entriesSize = 0
  data = 0
  constructor(private dashboardService:DashboardService){ }

  ngOnInit(){
    this.dashboardService.getEntries().subscribe(d=>{
      this.data = d.length
    })
  }

}
