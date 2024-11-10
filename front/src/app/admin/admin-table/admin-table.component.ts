import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-table.component.html',
  styleUrl: './admin-table.component.css'
})
export class AdminTableComponent implements OnInit{

  tableChoice: string[] = []
  tableSize: string[] = []
  // newId: number[] = []

  addFullName = ""
  addShortName = ""

  constructor(private dashboardService:DashboardService){ }

  ngOnInit() {
    this.dashboardService.getTableInfos()
    this.dashboardService.getTableChoice().subscribe(d=>{
      this.tableChoice = d
    })
    this.dashboardService.getListTableSize().subscribe(d=>this.tableSize = d)
  }

  changeTableId(up:boolean, id:number){
    this.dashboardService.changeTableId(up, id)
  }

  addTable(){
    this.dashboardService.addTable(this.addFullName, this.addShortName)
  }

}
