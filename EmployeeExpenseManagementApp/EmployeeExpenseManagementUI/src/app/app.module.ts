import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddExpenseFormComponent } from './components/add-expense-form/add-expense-form.component';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';
import { LoginComponent } from './components/login/login.component';
import { HandleExpenseComponent } from './components/handle-expense/handle-expense.component';
import { ViewExpenseComponent } from './components/view-expense/view-expense.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SingleExpenseComponent } from './components/single-expense/single-expense.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { DisplayExpenseFormsComponent } from './components/display-expense-forms/display-expense-forms.component';
import { DisplayExpenseFormDetailsComponent } from './components/display-expense-form-details/display-expense-form-details.component';
import { EditExpenseFormComponent } from './components/edit-expense-form/edit-expense-form.component';
import { EditExpenseComponent } from './components/edit-expense/edit-expense.component';
import { ExpenseFormHistoryComponent } from './components/expense-form-history/expense-form-history.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatTableModule } from '@angular/material/table';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReportsComponent } from './components/reports/reports.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
    AppComponent,
    AddExpenseFormComponent,
    ExpenseListComponent,
    LoginComponent,
    HandleExpenseComponent,
    ViewExpenseComponent,
    SingleExpenseComponent,
    NavbarComponent,
    MenuBarComponent,
    DisplayExpenseFormsComponent,
    DisplayExpenseFormDetailsComponent,
    EditExpenseFormComponent,
    EditExpenseComponent,
    ExpenseFormHistoryComponent,
    ReportsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatTableModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    MatPaginatorModule,
    ToastrModule.forRoot(),
  ],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
