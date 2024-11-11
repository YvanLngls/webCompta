import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { MatDialog } from '@angular/material/dialog';
import { InitDbConfirmationComponent } from './init-db-confirmation/init-db-confirmation.component';

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

  constructor(private dashboardService:DashboardService, public dialog:MatDialog) {  }

  ngOnInit(): void {
    this.dashboardService.getGeneralInfos()
    
    this.dashboardService.getListTableSize().subscribe(d=>this.tableSize = d.length)
    this.dashboardService.getDbInitializedState().subscribe(d=>{
      this.dbInitialized = d
      if(d>=0){
        if(d==0) this.dbInitializedLabel = "Not initialized"
        else if (d==1) this.dbInitializedLabel = "Initialized" 
      } 
      else this.dbInitializedLabel = "Error / Not initialized"
    })
    this.dashboardService.getCategorySize().subscribe(d=>this.categoriesSize=d)
  }

  initDb(){
    this.dialog.open(InitDbConfirmationComponent)
  }

}
