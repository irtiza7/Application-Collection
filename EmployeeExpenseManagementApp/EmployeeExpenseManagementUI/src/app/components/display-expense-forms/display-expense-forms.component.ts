import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-display-expense-forms',
  templateUrl: './display-expense-forms.component.html',
  styleUrl: './display-expense-forms.component.scss',
})
export class DisplayExpenseFormsComponent {
  private headingMappings = {
    Employee: 'Your Expenses',
    Manager: 'Expenses Awaiting Approval',
    Accountant: 'Expenses to be Paid',
    Admin: 'All Expenses',
  };

  public idOfLoggedInUser: number;
  public roleOfLoggedInUser: string;
  public heading: string;
  public expenseFormsFetchedFromApi: ExpenseFormApiResponse[] = [];
  public currencyFilter: string = 'All';
  public statusFilter: string = 'All';
  public filteredExpenseForms: any[];

  public isAdmin: boolean = false;
  public pageSize: number = 3;
  public currentPage: number = 1;
  public get paginatedExpenseForms(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredExpenseForms.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }
  public get totalPages(): number {
    return Math.ceil(this.filteredExpenseForms.length / this.pageSize);
  }

  private sub: Subject<void> = new Subject<void>();

  constructor(
    private readonly apiService: ApiService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.isAdmin = this.apiService.userInformationObject.role === 'Admin';
    this.initFields();
    this.fetchExpenseFormsFromApi();
  }

  ngOnDestroy() {
    this.sub.next();
    this.sub.complete();
  }

  private initFields() {
    this.heading =
      this.headingMappings[this.apiService.userInformationObject.role];

    this.idOfLoggedInUser =
      this.apiService.userInformationObject.employeeInfo.id;
    this.roleOfLoggedInUser = this.apiService.userInformationObject.role;
  }

  private fetchExpenseFormsFromApi() {
    this.apiService
      .fetchExpenseForms(this.idOfLoggedInUser, this.roleOfLoggedInUser)
      .pipe(takeUntil(this.sub))
      .subscribe((res) => {
        this.expenseFormsFetchedFromApi = res['expenseForms'];
        this.expenseFormsFetchedFromApi.forEach((form) => {
          form['expenseFormStatus'] = this.apiService.getKeyByValue(
            this.apiService.expenseStatusIdMapping,
            form.expenseStatusId
          );
        });

        this.filteredExpenseForms = this.expenseFormsFetchedFromApi.slice();

        console.log('Response [Fetch Expense Forms] - ', res['expenseForms']);
      });
  }

  public filterExpenseForms(): void {
    this.filteredExpenseForms = this.expenseFormsFetchedFromApi.filter(
      (form) => {
        let currencyTypeFilter: boolean;
        let expenseStatusFilter: boolean;

        if (this.currencyFilter === 'All') {
          currencyTypeFilter = true;
        } else {
          currencyTypeFilter =
            form.currencyTypeId ===
            this.apiService.currencyTypeIdMapping[this.currencyFilter];
        }

        if (this.statusFilter === 'All') {
          expenseStatusFilter = true;
        } else {
          expenseStatusFilter =
            form.expenseStatusId ===
            this.apiService.expenseStatusIdMapping[this.statusFilter];
        }

        return currencyTypeFilter && expenseStatusFilter;
      }
    );
  }

  public openExpenseFormDetails(expenseForm) {
    this.apiService.selectedExpenseForm = expenseForm;
    this.router.navigate(['/displayExpenseFormDetails']);
  }

  public previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  public nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}

export interface ExpenseFormApiResponse {
  id: number;
  createdDate: string;
  employeeId: number;
  currencyTypeId: number;
  expenseStatusId: number;
  managerComment: string;
  totalAmount: number;
  expenseFormStatus?: string;
}
