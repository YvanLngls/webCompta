import { Component } from '@angular/core';

@Component({
  selector: 'app-view-entry',
  standalone: true,
  imports: [],
  templateUrl: './view-entry.component.html',
  styleUrl: './view-entry.component.css'
})
export class ViewEntryComponent {

  date = "dd/mm/yyyy"
  value = 0
  note = "/"

}
