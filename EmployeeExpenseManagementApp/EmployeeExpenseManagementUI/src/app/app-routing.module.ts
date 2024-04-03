import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddExpenseFormComponent } from './components/add-expense-form/add-expense-form.component';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';
import { HandleExpenseComponent } from './components/handle-expense/handle-expense.component';
import { LoginComponent } from './components/login/login.component';
import { DisplayExpenseFormsComponent } from './components/display-expense-forms/display-expense-forms.component';
import { DisplayExpenseFormDetailsComponent } from './components/display-expense-form-details/display-expense-form-details.component';
import { ReportsComponent } from './components/reports/reports.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'add-expense', component: AddExpenseFormComponent },
  { path: 'expenses', component: ExpenseListComponent },
  { path: 'handle-expense/:id', component: HandleExpenseComponent },
  { path: 'displayExpenseForms', component: DisplayExpenseFormsComponent },
  {
    path: 'displayExpenseFormDetails',
    component: DisplayExpenseFormDetailsComponent,
  },
  { path: 'viewReports', component: ReportsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
