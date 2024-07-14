import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { debounceTime, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'debouncing';
  response: any[] = [];
  searchForm: FormGroup;
  totalCount: number=0 ;

  constructor(private http: HttpClient) {
    this.searchForm = new FormGroup({
      search: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.searchForm
      .get('search')
      ?.valueChanges.pipe(
        debounceTime(500), //500 milisec
        switchMap((search) =>
          search ? this.getUsers(search) : of({ items: [] })
        )
      )
      .subscribe({
        next: (res) => {
          this.totalCount=res.total_count;
          this.response = res && res.items ? res.items : [];
        },
        error: (error) => {
          this.response = [];
        },
      });
  }

  private getUsers(search: string) {
    const url = `https://api.github.com/search/users?q=${search}`;
    return this.http.get<any>(url);
  }
}
