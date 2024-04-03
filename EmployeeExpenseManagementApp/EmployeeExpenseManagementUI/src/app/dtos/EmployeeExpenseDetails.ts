export interface EmployeeExpenseDetails {
  id: number | string;
  title: string; // change by emp || exp
  amount: number | any; // change by emp || exp || expfor
  expenseDate: any; // change by emp || exp
  expenseFormId: number | string;
  expenseTypeId: number | string; // change by emp || exp
  expenseType: string;
  expenseStatusId: number; // change by man and acc ||
  expenseStatus: string;
  currencyTypeId: number; // change by
  currencyType: string;
  totalAmount: number;
  managerComment: string | null;
}
