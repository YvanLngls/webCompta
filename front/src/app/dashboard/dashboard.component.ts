import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

  tableChoice:string[] = []

  tableType:number = 0
  tableFullName:string = ""
  tableBalance:number = 0
  entriesType:string[] = []
  entriesDate:string[] = []
  entriesValue:string[] = []
  entriesNote:string[] = []
  entriesCategory:string[] = []

  totalIncome:string = "0"
  totalExpense:string = "0"

  constructor(private dashboardService:DashboardService){ }

  ngOnInit(){
    this.dashboardService.getTableChoiceClient()
    this.dashboardService.getEntries()
    this.dashboardService.getTableChoiceClient()

    this.dashboardService.getTableType().subscribe(d=>this.tableType = d)
    this.dashboardService.getTableFullname().subscribe(d=>this.tableFullName = d)
    this.dashboardService.getTableBalance().subscribe(d=>this.tableBalance = d)
    this.dashboardService.getEntriesType().subscribe(d=>this.entriesType = d)
    this.dashboardService.getEntriesDate().subscribe(d=>this.entriesDate = d)
    this.dashboardService.getEntriesValue().subscribe(d=>this.entriesValue = d)
    this.dashboardService.getEntriesNote().subscribe(d=>this.entriesNote = d)
    this.dashboardService.getEntriesCategory().subscribe(d=>this.entriesCategory = d)
    this.dashboardService.getTableChoice().subscribe(d=>this.tableChoice = d)
    this.dashboardService.getTotal().subscribe(d=>{
      this.totalIncome = d[0]
      this.totalExpense = d[1]
    })
  }

  changeTable(choice: number){
    this.dashboardService.changeTable(choice)
  }

}
