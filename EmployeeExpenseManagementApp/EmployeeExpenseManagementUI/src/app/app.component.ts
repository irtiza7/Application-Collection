import { Component } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public title = 'ExpenseAppFrontend';
  public showMenuBar: boolean;

  constructor(private readonly apiService: ApiService) {}

  ngOnInit() {
    this.apiService.showMenuBar.subscribe((signal) => {
      this.showMenuBar = signal;
    });
  }
}
