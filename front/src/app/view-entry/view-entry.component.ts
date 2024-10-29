import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-view-entry',
  standalone: true,
  imports: [],
  templateUrl: './view-entry.component.html',
  styleUrl: './view-entry.component.css'
})
export class ViewEntryComponent {

  @Input() date:string = "dd/mm/yyyy"
  @Input() value:string = "0"
  @Input() note:string = "/"

}
