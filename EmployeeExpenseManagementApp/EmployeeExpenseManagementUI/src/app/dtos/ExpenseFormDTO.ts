export interface ExpenseFormDTO {
  id?: any;
  totalAmount: number;
  managerComment: string | null;
  expenseStatusId: number;
  currencyTypeId: number;
  employeeId: number;
}
