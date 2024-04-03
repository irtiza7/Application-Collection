import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ExpenseFormDTO } from '../../dtos/ExpenseFormDTO';
import { ExpenseDTO } from '../../dtos/ExpenseDTO';
import { IndividualExpenseDTO } from '../../dtos/IndividualExpenseDTO';
import { ExpenseFormApiResponse } from '../display-expense-forms/display-expense-forms.component';
import { ExpenseApiResponse } from '../display-expense-form-details/display-expense-form-details.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-edit-expense-form',
  templateUrl: './edit-expense-form.component.html',
  styleUrl: './edit-expense-form.component.scss',
})
export class EditExpenseFormComponent implements OnInit {
  @Input({ required: true }) expenseForm: ExpenseFormApiResponse;
  @Input({ required: true }) listOfExpenses: ExpenseApiResponse[];

  @Output() cancelEditing: EventEmitter<any> = new EventEmitter();

  public numberOfExpenses: number = 0;
  public selectedCurrency: string = '';
  public totalAmountOfExpenses: number = 0;
  public error: boolean = false;
  public errorString: string = '';

  public maxAmountForExpense: number = 5000;
  public currencyTypes: string[];
  public expenseTypes: string[];

  private sub: Subject<void> = new Subject<void>();

  constructor(
    private readonly apiService: ApiService,
    private readonly router: Router,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit() {
    this.initFields();
  }

  ngOnDestroy() {
    this.sub.next();
    this.sub.complete();
  }

  private initFields() {
    this.numberOfExpenses = this.listOfExpenses.length;
    this.currencyTypes = this.apiService.currencyTypes;
    this.expenseTypes = this.apiService.expenseTypes;
    this.selectedCurrency = this.apiService.getKeyByValue(
      this.apiService.currencyTypeIdMapping,
      this.expenseForm.currencyTypeId
    );
    this.listOfExpenses.forEach((expense) => {
      this.totalAmountOfExpenses += expense.amount;
    });
  }

  public submitEditedExpenses() {
    this.error = false;

    if (this.validateCurrencySelection()) {
      this.setErrorMessage(`Selection of currency is mandatory`);
      this.error = true;
      return;
    }

    if (this.validateTitleOfAllExpenses()) {
      this.setErrorMessage(`Expenses should have valid titles.`);
      this.error = true;
      return;
    }

    if (this.validateDateOfAllExpenses()) {
      this.setErrorMessage(`Expenses should have date.`);
      this.error = true;
      return;
    }

    if (this.validateTotalAmountOfAllExpenses()) {
      this.setErrorMessage(`Total amount should be greater than 0`);
      this.error = true;
      return;
    }

    if (this.validateExpenseAmount()) {
      this.error = true;
      this.setErrorMessage(
        `Amount for each expense should be less than ${this.maxAmountForExpense}`
      );
      return;
    }

    var expenserFormToSubmit: ExpenseFormApiResponse = {
      id: this.expenseForm.id,
      totalAmount: this.totalAmountOfExpenses,
      managerComment: this.expenseForm.managerComment,
      expenseStatusId: this.apiService.expenseStatusIdMapping['Pending'],
      currencyTypeId:
        this.apiService.currencyTypeIdMapping[this.selectedCurrency],
      employeeId: this.apiService.userInformationObject.employeeInfo.id,
      createdDate: this.expenseForm.createdDate,
    };

    this.apiService
      .editExpenseForm(expenserFormToSubmit)
      .pipe(takeUntil(this.sub))
      .subscribe((response) => {
        this.toastr.success('Expense Form Editted Successfully');
        console.log('Response [Update Expense Form] - ', response);
        const updatedExpenseForm = response['updatedExpenseForm'];

        this.listOfExpenses.forEach((expense: ExpenseApiResponse) => {
          let expenseDataToSubmit: ExpenseApiResponse = {
            id: expense.id,
            title: expense.title,
            amount: expense.amount,
            expenseDate: expense.expenseDate,
            expenseFormId: updatedExpenseForm.id,
            expenseTypeId: expense.expenseTypeId,
          };
          this.apiService.editExpense(expenseDataToSubmit).subscribe((res) => {
            console.log('Response [Update Expense] - ', res);
          });
        });

        this.router.navigate(['/displayExpenseForms']);
      });
  }

  private validateTitleOfAllExpenses() {
    let check = false;
    this.listOfExpenses.forEach((expense) => {
      if (expense.title.length < 1) {
        check = true;
      }
    });
    return check;
  }

  private validateDateOfAllExpenses() {
    let check = false;
    this.listOfExpenses.forEach((expense) => {
      if (expense.expenseDate.length < 1) {
        check = true;
      }
    });
    return check;
  }

  private validateTotalAmountOfAllExpenses() {
    let totalAmount = 0;
    this.listOfExpenses.forEach((expense) => {
      totalAmount += expense.amount;
    });
    return totalAmount === 0;
  }

  private validateCurrencySelection() {
    return this.selectedCurrency.length < 1;
  }

  private validateExpenseAmount() {
    let check = false;
    this.listOfExpenses.forEach((element) => {
      if (element.amount > this.maxAmountForExpense) {
        check = true;
      }
    });
    return check;
  }

  private setErrorMessage(msg) {
    this.errorString = msg;
  }

  public handleExpenseAmountChangeEvent(expenseIndex: number) {
    let totalAmount = 0;
    this.listOfExpenses.forEach((expense) => {
      totalAmount += expense.amount;
    });
    this.totalAmountOfExpenses = totalAmount;
  }
}
