import { Component, Input } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthTableOptions } from '../../dtos/AuthTableOptions';
import { UserInformationObject } from '../../dtos/UserInformationObject';
import { EmployeeExpensesDTO } from '../../dtos/EmployeeExpensesDTO';
import { EmployeeExpenseDetails } from '../../dtos/EmployeeExpenseDetails';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.scss',
})
export class ExpenseListComponent {
  @Input({ required: true }) listOfExpenses: any;

  public showExpenseDetails: boolean = false;
  public selectedExpense: any;
  public fetchedExpensesFromApi: any = [];
  public employeeId: number;

  constructor(private readonly apiService: ApiService) {}

  ngOnInit() {
    this.employeeId = this.apiService.userInformationObject.employeeInfo.id;
    this.fetchEmployeeExpensesFromApi();
  }

  private async fetchEmployeeExpensesFromApi() {
    this.apiService
      .fetchExpensesAgainstEmployeeId(this.employeeId)
      .subscribe((res: EmployeeExpensesDTO) => {
        const employeeExpenses: EmployeeExpenseDetails[] = res.expensesList
          .map((expense) => {
            const expenseForm = res.expenseFormsList.find(
              (form) => form.id === expense.expenseFormId
            );
            if (!expenseForm) {
              return null;
            }

            const expenseType = Object.keys(
              this.apiService.expenseTypeIdMapping
            ).find(
              (key) =>
                this.apiService.expenseTypeIdMapping[key] ===
                expense.expenseTypeId
            );

            const expenseStatus = Object.keys(
              this.apiService.expenseStatusIdMapping
            ).find(
              (key) =>
                this.apiService.expenseStatusIdMapping[key] ===
                expenseForm.expenseStatusId
            );

            const currencyType = Object.keys(
              this.apiService.currencyTypeIdMapping
            ).find(
              (key) =>
                this.apiService.currencyTypeIdMapping[key] ===
                expenseForm.currencyTypeId
            );

            return {
              id: expense.id,
              title: expense.title,
              amount: expense.amount,
              expenseDate: expense.expenseDate,
              expenseFormId: expense.expenseFormId,
              expenseTypeId: expense.expenseTypeId,
              expenseType: expenseType || 'Unknown',
              expenseStatusId: expenseForm.expenseStatusId,
              expenseStatus: expenseStatus || 'Unknown',
              currencyTypeId: expenseForm.currencyTypeId,
              currencyType: currencyType || 'Unknown',
              totalAmount: expenseForm.totalAmount,
              managerComment: expenseForm.managerComment,
            };
          })
          .filter((expense) => expense !== null);

        this.fetchedExpensesFromApi = employeeExpenses;
        // console.log(this.fetchedExpensesFromApi);
      });
  }

  public viewExpenseDetails(expense) {
    this.showExpenseDetails = true;
    this.selectedExpense = expense;
  }

  public goBackButtonClicked() {
    this.showExpenseDetails = false;
  }

  getCurrencySymbol(currencyTypeId: number): string {
    switch (currencyTypeId) {
      case 1:
        return 'PKR';
      case 2:
        return 'IND';
      case 3:
        return 'USD';
      case 4:
        return 'TL';
      case 5:
        return 'EUR';
      default:
        return '';
    }
  }
}
