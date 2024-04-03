import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ExpenseApiResponse } from '../display-expense-form-details/display-expense-form-details.component';

@Component({
  selector: 'app-edit-expense',
  templateUrl: './edit-expense.component.html',
  styleUrl: './edit-expense.component.scss',
})
export class EditExpenseComponent {
  @Input({ required: true }) expense: ExpenseApiResponse;
  @Input({ required: true }) expenseTypes: any;
  @Input() expenseIndex: any = 0;

  @Output() expenseModifiedEvent = new EventEmitter<any>();
  @Output() expenseDeletedEvent = new EventEmitter<number>();
  @Output() expenseAmountChangeEvent = new EventEmitter<any>();

  public selectedExpenseType: string;

  constructor(private readonly apiService: ApiService) {}

  ngOnInit() {
    this.selectedExpenseType = this.apiService.getKeyByValue(
      this.apiService.expenseTypeIdMapping,
      this.expense.expenseTypeId
    );
  }

  public onExpenseTypeChange(selectedType: string) {
    this.selectedExpenseType = selectedType;
    this.expense.expenseTypeId =
      this.apiService.expenseTypeIdMapping[selectedType];
  }

  public deleteExpense() {
    this.expenseDeletedEvent.emit(this.expenseIndex);
  }

  public handleExpenseAmountChange(event) {
    this.expenseAmountChangeEvent.emit(this.expenseIndex);
  }

  public formatDateString(dateString: string): string {
    return dateString.split('T')[0];
  }
}
