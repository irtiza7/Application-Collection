import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthTableOptions } from '../../dtos/AuthTableOptions';
import { ApiService } from '../../services/api.service';
import { EmployeeExpenseDetails } from '../../dtos/EmployeeExpenseDetails';

@Component({
  selector: 'app-handle-expense',
  templateUrl: './handle-expense.component.html',
  styleUrls: ['./handle-expense.component.scss'],
})
export class HandleExpenseComponent {
  @Input() expense: EmployeeExpenseDetails;
  @Input() userType: string;

  @Output() expenseStatusModified = new EventEmitter<any>();
  @Output() goBackButtonClickedEvent = new EventEmitter<boolean>();

  public showEditExpenseComponent: boolean = false;
  public showCommentPanel = false;
  public showChangeStatusButton = false;
  public authTableOptions: AuthTableOptions;

  public currencyTypes: string[] = ['TL', 'EUR', 'USD', 'PKR', 'INR'];
  public expenseTypes: string[] = ['Fuel', 'Food', 'Transportation', 'Medical'];

  constructor(private readonly apiService: ApiService) {}

  ngOnInit() {
    this.subToAuthTableOptions();

    if (this.userType === 'Manager') {
      this.showChangeStatusButton = true;
      this.showCommentPanel = true;
    }
  }

  private subToAuthTableOptions() {
    this.apiService.authTableOptions.subscribe((options: AuthTableOptions) => {
      this.authTableOptions = options;
    });
  }

  public approveExpense() {}

  public editExpense() {
    this.showEditExpenseComponent = true;
  }

  public saveChanges() {
    this.showEditExpenseComponent = false;
  }

  public disapproveExpense() {}

  public payExpense() {}

  public goBack() {
    this.goBackButtonClickedEvent.emit(true);
  }
}
