using System.Linq;

namespace ExpenseAPI.Models
{
    public class Employee
    {
        public int? Id { get; set; }
        public string Name { get; set; } = string.Empty;    
        public string Designation { get; set; } = string.Empty;
        public int? ManagerId { get; set; } 
        public string AspNetUserId { get; set; } = string.Empty;

    }
}
