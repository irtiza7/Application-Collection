import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-single-expense',
  templateUrl: './single-expense.component.html',
  styleUrl: './single-expense.component.scss',
})
export class SingleExpenseComponent {
  @Input({ required: true }) expense: any;
  @Input({ required: true }) expenseTypes: any;
  @Input() expenseIndex: any = 0;
  @Input() showDeleteExpenseButton: boolean = true;

  @Output() expenseModifiedEvent = new EventEmitter<any>();
  @Output() expenseDeletedEvent = new EventEmitter<number>();
  @Output() expenseAmountChangeEvent = new EventEmitter<any>();

  expenseModified() {
    // console.log('Expense submitted for approval:', this.expense);
  }

  public deleteExpense() {
    this.expenseDeletedEvent.emit(this.expenseIndex);
  }

  public handleExpenseAmountChange(event) {
    this.expenseAmountChangeEvent.emit(this.expenseIndex);
  }
}
