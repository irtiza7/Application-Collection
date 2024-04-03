import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { ExpenseFormApiResponse } from '../display-expense-forms/display-expense-forms.component';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-display-expense-form-details',
  templateUrl: './display-expense-form-details.component.html',
  styleUrl: './display-expense-form-details.component.scss',
})
export class DisplayExpenseFormDetailsComponent implements OnInit {
  public selectedExpenseForm: ExpenseFormApiResponse;
  public fetchedExpenses: ExpenseApiResponse[] = [];
  public idOfLoggedInUser: number;
  public roleOfLoggedInUser: string;
  public switchExpenseFormToEditable: boolean = false;
  public showHistoryComponent: boolean = false;

  public error: boolean = false;
  public errorMessage: string = '';

  private sub: Subject<void> = new Subject<void>();

  constructor(
    private readonly apiService: ApiService,
    private readonly router: Router,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit() {
    this.initFields();
    this.fetchExpensesForSelectedExpenseForm();
  }

  ngOnDestroy() {
    this.sub.next();
    this.sub.complete();
  }

  private initFields() {
    this.idOfLoggedInUser =
      this.apiService.userInformationObject.employeeInfo.id;
    this.roleOfLoggedInUser = this.apiService.userInformationObject.role;

    this.selectedExpenseForm = this.apiService.selectedExpenseForm;
  }

  private fetchExpensesForSelectedExpenseForm() {
    this.apiService
      .fetchExpenses(this.selectedExpenseForm.id)
      .pipe(takeUntil(this.sub))
      .subscribe((res) => {
        this.fetchedExpenses = res['expensesList'];
        console.log('Response [Fetch Expenses] - ', this.fetchedExpenses);
      });
  }

  public changeExpenseFormStatus(statusTypeString: string) {
    if (
      statusTypeString === 'Rejected' &&
      this.selectedExpenseForm.managerComment.length < 1
    ) {
      this.error = true;
      this.errorMessage = 'Please Enter a Reason for Rejection';
      return;
    }

    const statusTypeId =
      this.apiService.expenseStatusIdMapping[statusTypeString];

    const expenseFormData: ExpenseFormApiResponse = {
      id: this.selectedExpenseForm.id,
      totalAmount: this.selectedExpenseForm.totalAmount,
      managerComment: this.selectedExpenseForm.managerComment,
      expenseStatusId: statusTypeId,
      employeeId: this.selectedExpenseForm.employeeId,
      currencyTypeId: this.selectedExpenseForm.currencyTypeId,
      createdDate: this.selectedExpenseForm.createdDate,
    };

    this.apiService
      .changeExpenseFormStatus(expenseFormData)
      .pipe(takeUntil(this.sub))
      .subscribe((response) => {
        this.toastr.success('Expense Form Status Changed Successfully');
        console.log('Response [Expense Form Status Change] - ', response);
        this.router.navigate(['/displayExpenseForms']);
      });
  }

  public getExpenseType(expenseTypeId: number): string {
    return this.apiService.getKeyByValue(
      this.apiService.expenseTypeIdMapping,
      expenseTypeId
    );
  }

  public getCurrencyType(currencyTypeId: number): string {
    return this.apiService.getKeyByValue(
      this.apiService.currencyTypeIdMapping,
      currencyTypeId
    );
  }

  public editExpenseFormButtonPressed() {
    this.switchExpenseFormToEditable = true;
  }

  public cancelEditingClicked() {
    this.switchExpenseFormToEditable = false;
  }

  public goBackClicked() {
    this.router.navigate(['/displayExpenseForms']);
  }

  public viewExpenseFormHistory() {
    this.showHistoryComponent = true;
  }

  public removeHistoryComponent() {
    this.showHistoryComponent = false;
  }
}

export interface ExpenseApiResponse {
  id: number;
  amount: number;
  expenseDate: string;
  expenseFormId: number;
  expenseTypeId: number;
  title: string;
}
