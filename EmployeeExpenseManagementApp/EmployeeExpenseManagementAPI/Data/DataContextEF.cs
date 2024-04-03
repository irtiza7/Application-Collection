using ExpenseAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace ExpenseAPI.Data
{

    public class DataContextEF : IdentityDbContext<IdentityUser>
    {
        public DataContextEF(DbContextOptions<DataContextEF> options)
        : base(options) { }

        public DbSet<Employee> Employee { get; set; }
        public DbSet<ExpenseForm> ExpenseForm { get; set; }
        public DbSet<Expense> Expense { get; set; }
        public DbSet<History> History { get; set; }
        
        public async Task<List<Employee>> GetEmployeesAsync()
        {
            return await Employee.ToListAsync();
        }

        public async Task<List<Employee>> GetEmployeesByAspNetUserIdAsync(string aspNetUserId)
        {
            try
            {
                return await Employee.Where(e => e.AspNetUserId == aspNetUserId).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception occurred: {ex.Message}");
                throw;
            }
        }



    }
    /*public class DataContextEF : IdentityDbContext<IdentityUser, IdentityRole>
    {
        public DbSet<ExpenseForm>? ExpenseForm { get; set; }
        public DbSet<Test>? Test { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured) {
                optionsBuilder.UseSqlServer("Data Source=KHIPAKNB033;Initial Catalog=ExpenseDB;Trusted_Connection=True;TrustServerCertificate=True;", optionsBuilder => optionsBuilder.EnableRetryOnFailure());
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("dbo");
            modelBuilder.Entity<Test>();
        }
    }*/
}
