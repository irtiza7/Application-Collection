using Newtonsoft.Json;

namespace ExpenseAPI.Models
{
    public class ExpenseForm
    {
        [JsonProperty("id")]
        public int? Id { get; set; }
        
        [JsonProperty("totalAmount")]
        public decimal TotalAmount { get; set; }
        
        [JsonProperty("date")]
        public DateTime? CreatedDate { get; set; }
        
        [JsonProperty("managerComment")]
        public string? ManagerComment { get; set; }
        
        [JsonProperty("expenseStatusId")]
        public int ExpenseStatusId { get; set; }
        
        [JsonProperty("employeeId")]
        public int EmployeeId { get; set; }
        
        [JsonProperty("currencyTypeId")]
        public int CurrencyTypeId { get; set; }
    }
}
