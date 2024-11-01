import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{

  tableChoice: string[] = []
  tableSize: string[] = []
  newId: number[] = []

  addFullName = ""
  addShortName = ""

  constructor(private dashboardService:DashboardService){ }

  ngOnInit() {
    this.dashboardService.getTableChoice().subscribe(d=>{
      this.tableChoice = d
      this.newId = []
      for(let i = 0; i<d.length; i++) this.newId.push(i)
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
