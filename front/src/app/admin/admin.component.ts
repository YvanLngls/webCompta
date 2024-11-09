import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminTableComponent } from "./admin-table/admin-table.component";
import { AdminGeneralComponent } from "./admin-general/admin-general.component";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, 
    FormsModule, 
    AdminTableComponent, 
    AdminGeneralComponent,
    MatSlideToggleModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  showGeneral = true
  showTable = false

}
