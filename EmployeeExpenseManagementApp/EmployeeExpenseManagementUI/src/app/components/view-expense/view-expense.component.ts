import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ExpenseFormDTO } from '../../dtos/ExpenseFormDTO';

@Component({
  selector: 'app-view-expense',
  templateUrl: './view-expense.component.html',
  styleUrl: './view-expense.component.scss',
})
export class ViewExpenseComponent implements OnInit {
  private headingMappings = {
    Employee: 'Your Expenses',
    Manager: 'Expenses Awaiting Approval',
    Accountant: 'Expenses to be Paid',
  };

  public idOfLoggedInUser: number;
  public roleOfLoggedInUser: string;
  public heading: string;
  public expenseFormsFetchedFromApi: any = [];

  constructor(private readonly apiService: ApiService) {}

  ngOnInit() {
    this.initFields();
    this.fetchExpenseFormsFromApi();
  }

  private initFields() {
    this.heading =
      this.headingMappings[
        this.apiService.userInformationObject?.employeeInfo?.designation
      ];
    this.idOfLoggedInUser =
      this.apiService.userInformationObject?.employeeInfo?.id;
    this.roleOfLoggedInUser = this.apiService.userInformationObject?.role;
  }

  private fetchExpenseFormsFromApi() {
    this.apiService
      .fetchExpenseForms(this.idOfLoggedInUser, this.roleOfLoggedInUser)
      .subscribe((res) => {
        // console.log(res['expenseForms']);
        this.expenseFormsFetchedFromApi = res['expenseForms'];

        this.expenseFormsFetchedFromApi.forEach((form) => {
          form['expenseFormStatus'] = this.apiService.getKeyByValue(
            this.apiService.expenseStatusIdMapping,
            form.expenseStatusId
          );
        });
      });
  }

  public openExpenseFormDetails(expenseForm) {}
}
