import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../dashboard.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

@Component({
  selector: 'app-edit-entry',
  standalone: true,
  imports: [FormsModule,
    MatSlideToggleModule,
    DatePipe
  ],
  templateUrl: './edit-entry.component.html',
  styleUrl: './edit-entry.component.css'
})
export class EditEntryComponent {

  entryType: boolean = false
  entryDate: string = ""
  entryValue: string = "0"
  entryNote: string = "/" 
  entryCategory: string = "Divers"

  constructor(private dashboardService:DashboardService){ }

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
