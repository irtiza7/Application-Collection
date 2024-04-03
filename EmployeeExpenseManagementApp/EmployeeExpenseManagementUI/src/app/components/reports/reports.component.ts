import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ExpenseFormApiResponse } from '../display-expense-forms/display-expense-forms.component';
import { Subject, takeUntil } from 'rxjs';
import { ExpenseApiResponse } from '../display-expense-form-details/display-expense-form-details.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent {
  public individualExpensesPerType;
  public expenseFormsPerStatus;
  public expenseFormsAndExpensesAmountPerEmployee;

  public currencyTypeIdMapping = { PKR: 1, IND: 2, USD: 3, TL: 4, EUR: 5 };
  public idToExpenseStatusMapping = {
    1: 'Pending',
    2: 'Approved',
    3: 'Rejected',
    4: 'Paid',
  };
  public idToExpenseTypeMapping = {
    5: 'Fuel',
    6: 'Food',
    7: 'Transportation',
    8: 'Medical',
  };

  private expenseFormsList: ExpenseFormApiResponse[];
  private individualExpensesList: ExpenseApiResponse[];
  private employeesList: EmployeeApiResponse[];
  private sub: Subject<void> = new Subject<void>();

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchExpenseForms();
    this.fetchAllExpenses();
    this.fetchAllEmployees();
  }

  ngOnDestroy() {
    this.sub.next();
    this.sub.complete();
  }

  private fetchExpenseForms() {
    this.apiService
      .fetchExpenseForms(
        this.apiService.userInformationObject.employeeInfo.id,
        this.apiService.userInformationObject.role
      )
      .pipe(takeUntil(this.sub))
      .subscribe((res) => {
        this.expenseFormsList = res['expenseForms'];
        this.expenseFormsPerStatus = this.convertDictToArray(
          this.calculateExpenseFormsPerExpenseStatus(this.expenseFormsList)
        );
      });
  }

  private calculateExpenseFormsPerExpenseStatus(
    expenseForms: ExpenseFormApiResponse[]
  ): { [key: string]: number } {
    const expenseFormsPerExpenseStatus: { [key: string]: number } = {};

    for (const form of expenseForms) {
      const expenseStatus = this.idToExpenseStatusMapping[form.expenseStatusId];
      if (expenseStatus) {
        expenseFormsPerExpenseStatus[expenseStatus] =
          (expenseFormsPerExpenseStatus[expenseStatus] || 0) + 1;
      }
    }
    return expenseFormsPerExpenseStatus;
  }

  private fetchAllExpenses() {
    this.apiService
      .fetchAllIndividualExpenses(this.apiService.userInformationObject.role)
      .pipe(takeUntil(this.sub))
      .subscribe((res) => {
        this.individualExpensesList = res['expensesList'];
        this.individualExpensesPerType = this.convertDictToArray(
          this.calculateIndividualExpensesPerExpenseType(
            this.individualExpensesList
          )
        );
      });
  }

  private calculateIndividualExpensesPerExpenseType(
    expenses: ExpenseApiResponse[]
  ): ExpenseTypeTotal {
    const expenseTypeTotal: ExpenseTypeTotal = {};

    expenses.forEach((expense) => {
      const expenseType = this.idToExpenseTypeMapping[expense.expenseTypeId];
      if (expenseType) {
        expenseTypeTotal[expenseType] =
          (expenseTypeTotal[expenseType] || 0) + 1;
      }
    });

    return expenseTypeTotal;
  }

  private fetchAllEmployees() {
    this.apiService
      .fetchAllEmployees(this.apiService.userInformationObject.role)
      .pipe(takeUntil(this.sub))
      .subscribe((res) => {
        this.employeesList = res['employeeList'];
        this.expenseFormsAndExpensesAmountPerEmployee =
          this.calculateNumberOfExpenseFormsAndExpensesAmountPerEmployee(
            this.employeesList
          );
      });
  }

  private calculateNumberOfExpenseFormsAndExpensesAmountPerEmployee(
    employees: EmployeeApiResponse[]
  ): EmployeeSummary[] {
    const employeeSummary: EmployeeSummary[] = [];

    for (const employee of employees) {
      if (employee.managerId) {
        const numberOfExpenseForms = this.expenseFormsList.filter(
          (form) => form.employeeId === employee.id
        ).length;
        const totalExpensesAmount = this.expenseFormsList.reduce(
          (total, form) => {
            if (form.employeeId === employee.id) {
              return total + form.totalAmount;
            }
            return total;
          },
          0
        );
        const manager = employees.find(
          (emp) => emp.id === employee.managerId
        )?.name;

        employeeSummary.push({
          id: employee.id,
          name: employee.name,
          manager: manager,
          numberOfExpenseForms: numberOfExpenseForms,
          totalExpensesAmount: totalExpensesAmount,
        });
      }
    }

    return employeeSummary;
  }

  private convertDictToArray(dict: {
    [key: string]: number;
  }): { name: string; value: number }[] {
    return Object.keys(dict).map((key) => ({ name: key, value: dict[key] }));
  }
}

export interface ExpenseTypeTotal {
  [key: string]: number;
}

export interface EmployeeApiResponse {
  id: number;
  name: string;
  designation: string;
  managerId: null | number;
  aspNetUserId: string;
}

export interface EmployeeSummary {
  id: number;
  name: string;
  manager: string | null;
  numberOfExpenseForms: number;
  totalExpensesAmount: number;
}
