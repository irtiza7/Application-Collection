import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthTableOptions } from '../../dtos/AuthTableOptions';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.scss',
})
export class MenuBarComponent {
  public isUserAutheticated: boolean = false;
  public showAddExpenseButtonToEmployee: boolean = false;
  public showReports: boolean = false;

  constructor(private readonly apiService: ApiService) {}

  ngOnInit() {
    this.subToAuthTableOptions();
    this.subToUserAutheticationStatus();
  }

  private subToAuthTableOptions() {
    this.apiService.authTableOptions.subscribe((options: AuthTableOptions) => {
      this.showAddExpenseButtonToEmployee =
        options.showAddExpenseOptionInMenuBar;
      this.showReports = options.userType === 'Admin';
    });
  }

  private subToUserAutheticationStatus() {
    this.apiService.isUserAuthenticated.subscribe((status: boolean) => {
      this.isUserAutheticated = status;
    });
  }
}
