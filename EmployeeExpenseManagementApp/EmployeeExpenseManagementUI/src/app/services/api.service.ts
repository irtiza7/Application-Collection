import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthTableOptions } from '../dtos/AuthTableOptions';
import { UserInformationObject } from '../dtos/UserInformationObject';
import { ExpenseFormApiResponse } from '../components/display-expense-forms/display-expense-forms.component';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'https://localhost:44382';

  public currencyTypes: string[] = ['TL', 'EUR', 'USD', 'PKR', 'IND'];
  public expenseTypes: string[] = ['Fuel', 'Food', 'Transportation', 'Medical'];
  public showMenuBar: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /* Mappings */
  public currencyTypeIdMapping = { PKR: 1, IND: 2, USD: 3, TL: 4, EUR: 5 };
  public expenseStatusIdMapping = {
    Pending: 1,
    Approved: 2,
    Rejected: 3,
    Paid: 4,
  };
  public expenseTypeIdMapping = {
    Fuel: 5,
    Food: 6,
    Transportation: 7,
    Medical: 8,
  };

  /* State Variables */
  public selectedExpenseForm: ExpenseFormApiResponse;
  public userInformationObject: UserInformationObject;
  public userNameAndRole: BehaviorSubject<any> = new BehaviorSubject({
    userName: '',
    userRole: '',
  });
  public authTableOptions: BehaviorSubject<AuthTableOptions> =
    new BehaviorSubject<AuthTableOptions>({
      showAddExpenseOptionInMenuBar: false,
      showApproveAndRejectButtonsForManager: false,
      showPayButtonForAccountant: false,
      userType: '',
      addCommentForManager: false,
    });
  public isUserAuthenticated: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient) {}

  public initAuthTableOptions(userType: string) {
    if (userType === 'Manager') {
      this.authTableOptions.next({
        userType: userType,
        addCommentForManager: true,
        showAddExpenseOptionInMenuBar: false,
        showPayButtonForAccountant: false,
        showApproveAndRejectButtonsForManager: true,
      });
    } else if (userType === 'Employee') {
      this.authTableOptions.next({
        userType: userType,
        addCommentForManager: false,
        showAddExpenseOptionInMenuBar: true,
        showPayButtonForAccountant: false,
        showApproveAndRejectButtonsForManager: false,
      });
    } else if (userType === 'Accountant') {
      this.authTableOptions.next({
        userType: userType,
        addCommentForManager: false,
        showAddExpenseOptionInMenuBar: false,
        showPayButtonForAccountant: true,
        showApproveAndRejectButtonsForManager: false,
      });
    } else if (userType === 'Admin') {
      this.authTableOptions.next({
        userType: userType,
        addCommentForManager: false,
        showAddExpenseOptionInMenuBar: false,
        showPayButtonForAccountant: false,
        showApproveAndRejectButtonsForManager: false,
      });
    }
  }

  /* Helping Methods */
  public getKeyByValue(mappingObject: any, value: any): string | null {
    for (const key in mappingObject) {
      if (mappingObject[key] === value) {
        return key;
      }
    }
    return null;
  }

  /* API Methods */
  public loginUser(loginUserData: {}) {
    const url = `${this.baseUrl}/login`;
    return this.httpClient.post<string>(url, loginUserData);
  }

  public fetchExpenseForms(userId: number, userRole) {
    const url = `${this.baseUrl}/expense/form/list?userId=${userId}&userRole=${userRole}`;
    return this.httpClient.get<any>(url);
  }

  public fetchExpenses(expenseFormId: number) {
    const url = `${this.baseUrl}/expense/list?expenseFormId=${expenseFormId}`;
    return this.httpClient.get<any>(url);
  }

  public editExpenseForm(expenseFormData: {}) {
    const url = `${this.baseUrl}/expense/form/edit`;
    return this.httpClient.post<any>(url, expenseFormData);
  }

  public changeExpenseFormStatus(expenseFormData: {}) {
    const url = `${this.baseUrl}/expense/form/edit/status`;
    return this.httpClient.post<any>(url, expenseFormData);
  }

  public editExpense(expenseData: {}) {
    const url = `${this.baseUrl}/expense/expense/edit`;
    return this.httpClient.post<any>(url, expenseData);
  }

  public submitExpenseForm(expenseFormData: {}) {
    const url = `${this.baseUrl}/expense/form/submit`;
    return this.httpClient.post<string>(url, expenseFormData);
  }

  public fetchExpensesAgainstEmployeeId(employeeId: number) {
    const url = `${this.baseUrl}/expense/expenses/list?employeeId=${employeeId}`;
    return this.httpClient.get<any>(url);
  }

  public submitIndividualExpense(expenseData: {}) {
    const url = `${this.baseUrl}/expense/expense/submit`;
    return this.httpClient.post<string>(url, expenseData);
  }

  public fetchExpenseFormHistory(expenseFormId: number) {
    const url = `${this.baseUrl}/expense/form/history?expenseFormId=${expenseFormId}`;
    return this.httpClient.get<string>(url);
  }

  public fetchAllIndividualExpenses(role: string) {
    const url = `${this.baseUrl}/expense/expenses/list/all?role=${role}`;
    return this.httpClient.get<string>(url);
  }

  public fetchAllEmployees(role: string) {
    const url = `${this.baseUrl}/expense/employee/list/all?role=${role}`;
    return this.httpClient.get<string>(url);
  }
}
