import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-admin-general',
  standalone: true,
  imports: [],
  templateUrl: './admin-general.component.html',
  styleUrl: './admin-general.component.css'
})
export class AdminGeneralComponent implements OnInit{

  dbInitializedLabel!:string;
  dbInitialized!:number;
  tableSize!:number;
  categoriesSize!:number;

  constructor(private dashboardService:DashboardService) {  }

  ngOnInit(): void {
    this.dashboardService.getListTableSize().subscribe(d=>this.tableSize = d.length)
    this.dashboardService.getDbInitializedState().subscribe(d=>{
      this.dbInitialized = d
      if(d>=0){
        if(d==0) this.dbInitializedLabel = "Not initialized"
        else if (d==1) this.dbInitializedLabel = "Initialized" 
      } 
      else this.dbInitializedLabel = "Error / Not initialized"
    })
  
  }

}
