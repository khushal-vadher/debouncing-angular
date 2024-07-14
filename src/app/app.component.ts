import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'debouncing';
  searchForm!:FormGroup;
  constructor(private http:HttpClient){
    this.searchForm=new FormGroup({
      search:new FormControl('Arrabiata')
    })
  }
  ngOnInit(): void {
      this.getMeals(this.searchForm.get('search')?.value);
  }
  private getMeals(search:string){
    const url:string=`www.themealdb.com/api/json/v1/1/search.php?s=${search}`
    this.http.get(url).pipe(
      debounceTime(50000)
    ).subscribe({
      next:(res)=>{
        console.log(res);
      },
      error:(error)=>{
        console.error(error);
      }
  })
  }
}
