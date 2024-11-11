import { Component } from '@angular/core';
import { DashboardService } from '../../../dashboard.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-init-db-confirmation',
  standalone: true,
  imports: [],
  templateUrl: './init-db-confirmation.component.html',
  styleUrl: './init-db-confirmation.component.css'
})
export class InitDbConfirmationComponent {

  constructor(private dashboardService:DashboardService, public dialogRef: MatDialogRef<InitDbConfirmationComponent>) {  }

  confirm(){
    this.dashboardService.initDB() 
    this.dialogRef.close()
  }

  close(){
    this.dialogRef.close()
  }


}
