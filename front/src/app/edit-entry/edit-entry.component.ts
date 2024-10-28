import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-edit-entry',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-entry.component.html',
  styleUrl: './edit-entry.component.css'
})
export class EditEntryComponent {

  entryType: boolean = false
  entryDate: string = "0"
  entryValue: string = "0"
  entryNote: string = "/" 

  constructor(private dashboardService:DashboardService){ }

  submitEntry(){
    this.dashboardService.submitEntry("entryType:"+(this.entryType?"1":"0")
      +",entryDate:"+this.entryDate
      +",entryValue:"+this.entryValue
      +",entryNote:"+this.entryNote)
  }

}
