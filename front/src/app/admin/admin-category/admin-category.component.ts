import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-category.component.html',
  styleUrl: './admin-category.component.css'
})
export class AdminCategoryComponent {

  categories:string[] = ["Maison", "Loisir"]

  newCategoryName: string = ""

  addCategory(){

  }

  changeCategory(up:boolean, id:number){
    
  }

}
