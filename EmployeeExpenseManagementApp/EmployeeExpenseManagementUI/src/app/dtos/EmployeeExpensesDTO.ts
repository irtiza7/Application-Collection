import { ExpenseDTO } from './ExpenseDTO';
import { ExpenseFormDTO } from './ExpenseFormDTO';

export interface EmployeeExpensesDTO {
  expenseFormsList: ExpenseFormDTO[];
  expensesList: ExpenseDTO[];
}
