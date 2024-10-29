import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.css'
})
export class LobbyComponent {

  constructor(private router:Router){ }

  navigate(path:string){
    this.router.navigate([path])
  }

}
