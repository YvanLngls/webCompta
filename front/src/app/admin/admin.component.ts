import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{

  tableChoice: string[] = []
  tableSize: string[] = []
  constructor(private dashboardService:DashboardService){ }

  ngOnInit() {
    this.dashboardService.getTableChoice().subscribe(d=>this.tableChoice = d)
    this.dashboardService.getListTableSize().subscribe(d=>this.tableSize = d)
  }

}
