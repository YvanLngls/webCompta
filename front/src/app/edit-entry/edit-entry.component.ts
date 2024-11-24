import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../dashboard.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

@Component({
  selector: 'app-edit-entry',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatSlideToggleModule,
    DatePipe
  ],
  templateUrl: './edit-entry.component.html',
  styleUrl: './edit-entry.component.css'
})
export class EditEntryComponent implements OnInit{

  entryType: boolean = false
  entryDate: string = ""
  entryValue: string = "0"
  entryNote: string = "/" 
  entryCategory: {value: string}[] = []

  constructor(private dashboardService:DashboardService){ }

  ngOnInit(): void {
    this.dashboardService.reqCategoryList()
    this.dashboardService.getCategoryList().subscribe(d=>this.entryCategory = d.map(item => ({ value: item })))
  }

  submitEntry(){

    const entryData = {entryType: this.entryType,
      entryDate: new DatePipe("fr-FR").transform(this.entryDate,"dd/MM/yyyy"),
      entryValue: this.entryValue,
      entryNote: this.entryNote,
      entryCategory: this.entryCategory
    }

    this.dashboardService.submitEntry(entryData)
  }

}
