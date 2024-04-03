import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExpenseFormApiResponse } from '../display-expense-forms/display-expense-forms.component';
import { ApiService } from '../../services/api.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-expense-form-history',
  templateUrl: './expense-form-history.component.html',
  styleUrl: './expense-form-history.component.scss',
})
export class ExpenseFormHistoryComponent {
  @Input({ required: true }) selectedExpenseForm: ExpenseFormApiResponse;
  @Output() backButtonPressed: EventEmitter<boolean> = new EventEmitter();

  public events = [];
  public displayedColumns: string[] = ['description', 'dateOfEvent'];

  private sub: Subject<void> = new Subject<void>();

  constructor(private readonly apiService: ApiService) {}

  ngOnInit() {
    this.fetchExpenseFormHistory();
  }

  ngOnDestroy() {
    this.sub.next();
    this.sub.complete();
  }

  private fetchExpenseFormHistory() {
    this.apiService
      .fetchExpenseFormHistory(this.selectedExpenseForm.id)
      .pipe(takeUntil(this.sub))
      .subscribe((response) => {
        console.log(response);
        this.events = response['expenseFormEvents'];
      });
  }
}
