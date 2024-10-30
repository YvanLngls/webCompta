import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditEntryComponent } from '../edit-entry/edit-entry.component';
import { ViewEntryComponent } from '../view-entry/view-entry.component';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    EditEntryComponent,
    ViewEntryComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  showTableChoice = false
  tableChoice:string[] = []

  entriesType:string[] = []
  entriesDate:string[] = []
  entriesValue:string[] = []
  entriesNote:string[] = []

  constructor(private dashboardService:DashboardService){ }

  ngOnInit(){
    this.dashboardService.getEntriesType().subscribe(d=>this.entriesType = d)
    this.dashboardService.getEntriesDate().subscribe(d=>this.entriesDate = d)
    this.dashboardService.getEntriesValue().subscribe(d=>this.entriesValue = d)
    this.dashboardService.getEntriesNote().subscribe(d=>this.entriesNote = d)
    this.dashboardService.getTableChoice().subscribe(d=>this.tableChoice = d)
  }

}
