import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-admin-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-category.component.html',
  styleUrl: './admin-category.component.css'
})
export class AdminCategoryComponent implements OnInit{

  categories: {value: string}[] = []

  newCategoryName: string = ""

  constructor(private dashboardService: DashboardService){ }

  ngOnInit(): void {
    this.dashboardService.reqCategoryList()
    this.dashboardService.getCategoryList().subscribe(d=>this.categories = d.map(item => ({ value: item })))
  }

  addCategory(){
    this.dashboardService.addCategory(this.newCategoryName)
    this.newCategoryName = ""
  }

  changeCategory(up:boolean, id:number){
    this.dashboardService.changeCategoryId(up, id)
  }

  changeCategoryName(id:number){
    this.dashboardService.changeCategoryName(id, this.categories[id].value)
  }

}
