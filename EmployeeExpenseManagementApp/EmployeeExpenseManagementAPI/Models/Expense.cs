namespace ExpenseAPI.Models
{
    public class Expense
    {
        public int? Id { get; set; }
        public string? Title { get; set; }
        public decimal Amount { get; set; }
        public DateTime? ExpenseDate { get; set; }
        public int ExpenseFormId {get; set;}
        public int ExpenseTypeId { get; set; }

    }
}
