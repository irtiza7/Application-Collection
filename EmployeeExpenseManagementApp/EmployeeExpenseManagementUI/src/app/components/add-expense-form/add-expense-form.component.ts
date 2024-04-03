import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ExpenseDTO } from '../../../../dto/ExpenseDTO';
import { ExpenseFormDTO } from '../../dtos/ExpenseFormDTO';
import { ApiService } from '../../services/api.service';
import { IndividualExpenseDTO } from '../../dtos/IndividualExpenseDTO';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-expense-form',
  templateUrl: './add-expense-form.component.html',
  styleUrl: './add-expense-form.component.scss',
})
export class AddExpenseFormComponent implements OnInit {
  public numberOfExpenses: number = 0;
  public listOfExpenses: ExpenseDTO[] = [];

  public selectedCurrency: string = '';
  public totalAmountOfExpenses: number = 0;
  public error: boolean = false;
  public errorString: string = '';

  public currencyTypes: string[] = ['TL', 'EUR', 'USD', 'PKR', 'IND'];
  public expenseTypes: string[] = ['Fuel', 'Food', 'Transportation', 'Medical'];
  public maxAmountForExpense: number = 5000;

  constructor(
    private readonly apiService: ApiService,
    private readonly router: Router,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit() {
    this.numberOfExpenses = 1;
    this.addExpense();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

  calculateTotal() {
    console.log('Recalculating the total amount');
  }

  public submitExpenses() {
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

    var expenserFormToSubmit: ExpenseFormDTO = {
      totalAmount: this.totalAmountOfExpenses,
      managerComment: '',
      expenseStatusId: this.apiService.expenseStatusIdMapping['Pending'],
      currencyTypeId:
        this.apiService.currencyTypeIdMapping[this.selectedCurrency],
      employeeId: this.apiService.userInformationObject.employeeInfo.id,
    };

    this.apiService.submitExpenseForm(expenserFormToSubmit).subscribe(
      (res) => {
        this.toastr.success('Expense Form Submitted Successfully');
        console.log(
          `API [ExpenseFormSubmit] - ${(res['message'], res['expenseFormId'])}`
        );

        this.router.navigate(['displayExpenseForms']);

        if (res['expenseFormId'] >= 0) {
          let expenseFormId: number = res['expenseFormId'];

          this.listOfExpenses.forEach((expense: ExpenseDTO) => {
            let expenseDataToSubmit: IndividualExpenseDTO = {
              title: expense.title,
              amount: expense.amount,
              expenseDate: expense.date,
              expenseFormId: expenseFormId,
              expenseTypeId: this.apiService.expenseTypeIdMapping[expense.type],
            };
            this.apiService
              .submitIndividualExpense(expenseDataToSubmit)
              .subscribe(
                (res) => {
                  console.log(`API [ExpenseFormSubmit] - ${res['message']}`);
                },
                (error) => {
                  this.toastr.error(error);
                }
              );
          });
        }
      },
      (error) => {
        this.toastr.error(error);
      }
    );
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
      if (expense.date.length < 1) {
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

  public addExpense() {
    let emptyExpense: ExpenseDTO = {
      title: `Expense ${this.listOfExpenses.length + 1}`,
      type: 'Fuel',
      amount: 0,
      date: '',
    };
    this.listOfExpenses.push(emptyExpense);
  }

  public handleExpenseDeletionEvent(deletedExpenseIndex: number) {
    this.listOfExpenses.splice(deletedExpenseIndex, 1);
  }

  public handleExpenseAmountChangeEvent(expenseIndex: number) {
    let totalAmount = 0;
    this.listOfExpenses.forEach((expense) => {
      totalAmount += expense.amount;
    });
    this.totalAmountOfExpenses = totalAmount;
  }
}

// interface Expense {
//   title: string;
//   type: any;
//   amount: number;
//   date: any;
// }
