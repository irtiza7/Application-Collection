﻿namespace ExpenseAPI.Models
{
    public class History
    {
        public int? Id { get; set; }
        public string Description { get; set; }
        public DateOnly CreatedDate { get; set; }
        public int ExpenseFormId { get; set; }

        public History(string description, DateOnly createdDate, int expenseFormId) {

            Description = description;
            CreatedDate = createdDate;
            ExpenseFormId = expenseFormId;
        }
    }
}
