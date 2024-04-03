using Microsoft.AspNetCore.Mvc;
using ExpenseAPI.Models;
using ExpenseAPI.Data;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Microsoft.Data.SqlClient;
using System.Data.Common;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    public class ExpenseFormController : ControllerBase {
        //public DataContextEF dbConncetions = new DataContextEF();
        private readonly IConfiguration _config;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly DataContextEF _dbContext;
        private string connectionString = "DefaultConnection";


        public ExpenseFormController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, DataContextEF dbContext)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _dbContext = dbContext;
        }

        //public Expense(IConfiguration config)
        //{
        //    _config = config;
        //}

        //public DbConnection GetDbConnection()
        //{
        //    return new SqlConnection(_config.GetConnectionString(connectionString));
        //}


        [HttpPost]
        [Route("/expense/form/submit")]
        public async Task<IActionResult> InsertExpenseFormIntoDb([FromBody] ExpenseForm expenseFormData)
        {
            if (expenseFormData != null) {
                DateTime currentDate = DateTime.Now.Date;
                expenseFormData.CreatedDate = currentDate;
                
                _dbContext.ExpenseForm.Add(expenseFormData);
                await _dbContext.SaveChangesAsync();

                int expenseFormId = (int)expenseFormData.Id;

                DateOnly date = new DateOnly(DateTime.Today.Year, DateTime.Today.Month, DateTime.Today.Day);
                History historyEvent = new History("Form Created",date,expenseFormId);
                _dbContext.History.Add(historyEvent);
                await _dbContext.SaveChangesAsync();

                return Ok(new { message = "Expense Form inserted", expenseFormId = expenseFormId});
            }
            return BadRequest(new { message = "Expense Form not inserted" });
        }

        [HttpPost]
        [Route("/expense/expense/submit")]
        public async Task<IActionResult> InsertExpenseIntoDb([FromBody] Expense expenseData)
        {
            if (expenseData != null)
            {
                _dbContext.Expense.Add(expenseData);
                await _dbContext.SaveChangesAsync();
                return Ok(new { message = "Individual Expense inserted" });
            }
            return BadRequest(new { message = "Individual Expense not inserted" });
        }

        [HttpGet]
        [Route("/expense/form/list")]
        public IActionResult GetExpenseFormsFromDb([FromQuery] int userId, [FromQuery] string userRole)
        {
            try
            {
                if (userRole == "Employee")
                {
                    var expenseForms = _dbContext.ExpenseForm
                        .Where(ef => ef.EmployeeId == userId)
                        .OrderByDescending(ef => ef.CreatedDate)
                        .ToList();
                    
                    var response = new { expenseForms = expenseForms };
                    return Ok(response);
                }
                else if (userRole == "Manager")
                {
                    var employeeIds = _dbContext.Employee
                        .Where(e => e.ManagerId == userId)
                        .Select(e => e.Id)
                        .ToList();

                    var expenseForms = _dbContext.ExpenseForm.ToList()
                        .Where(ef => employeeIds.Contains(ef.EmployeeId))
                        .Where(ef => ef.ExpenseStatusId == 1)
                        .OrderByDescending(ef => ef.CreatedDate)
                        .ToList();

                    var response = new { expenseForms = expenseForms };
                    return Ok(response);
                }

                else if (userRole == "Accountant")
                {
                    var expenseForms = _dbContext.ExpenseForm
                        .Where(ef => ef.ExpenseStatusId == 2)
                        .ToList();

                    var response = new { expenseForms = expenseForms };
                    return Ok(response);
                }
                else if (userRole == "Admin")
                {
                    var expenseForms = _dbContext.ExpenseForm
                        .OrderByDescending(ef => ef.CreatedDate)
                        .ToList();

                    var response = new { expenseForms = expenseForms };
                    return Ok(response);
                }
                else
                {
                    return BadRequest("Invalid user role");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }


        [HttpGet]
        [Route("/expense/expenses/list")]
        public IActionResult GetExpensesFromDb([FromQuery] int employeeId)
        {
            try
            { 
                var expenseFormIds = _dbContext.ExpenseForm
                    .Where(ef => ef.EmployeeId == employeeId)
                    .Select(ef => ef.Id)
                    .ToList();
                var expenses = _dbContext.Expense.ToList().Where(e => expenseFormIds.Contains(e.ExpenseFormId)).ToList();
                var expenseForms = _dbContext.ExpenseForm.Where(ef => ef.EmployeeId == employeeId).ToList();
                var response = new { expensesList = expenses, expenseFormsList = expenseForms };
                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("/expense/expenses/list/all")]
        public IActionResult GetAllExpensesFromDb([FromQuery] string role)
        {
            try
            {
                if (role == "Admin")
                {
                    var expenses = _dbContext.Expense.ToList();
                    var response = new { expensesList = expenses};
                    return Ok(response);
                }
                else {
                    return BadRequest(new { message = "You are not authorized to view all expenses" });
                        }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("/expense/employee/list/all")]
        public IActionResult GetAllEmployeesFromDb([FromQuery] string role)
        {
            try
            {
                if (role == "Admin")
                {
                    var employees = _dbContext.Employee.ToList();
                    var response = new { employeeList = employees };
                    return Ok(response);
                }
                else
                {
                    return BadRequest(new { messae = "You are not authorized to view all employees" });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("/expense/list")]
        public IActionResult GetExpensesAgainstExpenseFormIdFromDb([FromQuery] int expenseFormId)
        {
            try
            {
                var expenses = _dbContext.Expense
                    .Where(e => e.ExpenseFormId == expenseFormId)
                    .ToList();

                var response = new { expensesList = expenses};
                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("/expense/form/edit")]
        public async Task<IActionResult> EditExpenseFormInDb([FromBody] ExpenseForm expenseFormData)
        {
            try
            {
                if (expenseFormData == null)
                {
                    return BadRequest("Expense form data is null.");
                }

                DateTime currentDate = DateTime.Now.Date;
                expenseFormData.CreatedDate = currentDate;

                _dbContext.ExpenseForm.Update(expenseFormData);
                await _dbContext.SaveChangesAsync();

                int expenseFormId = (int)expenseFormData.Id;

                DateOnly date = new DateOnly(DateTime.Today.Year, DateTime.Today.Month, DateTime.Today.Day);
                History historyEvent = new History("Form Edited", date, expenseFormId);
                _dbContext.History.Add(historyEvent);
                await _dbContext.SaveChangesAsync();

                return Ok(new { message = "Expense Form Updated", expenseFormId = expenseFormId, updatedExpenseForm = expenseFormData});
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }


        [HttpPost]
        [Route("/expense/expense/edit")]
        public async Task<IActionResult> EditExpenseInDb([FromBody] Expense expenseData)
        {
            try
            {
                if (expenseData == null)
                {
                    return BadRequest("Expense data is null.");
                }

                _dbContext.Expense.Update(expenseData);
                await _dbContext.SaveChangesAsync();

                int expenseId = (int)expenseData.Id;
                var response = new { message = "Expense Updated", expenseId = expenseId, updatedExpense = expenseData };

                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("/expense/form/edit/status")]
        public async Task<IActionResult> EditExpenseFormStatus([FromBody] ExpenseForm expenseFormData)
        {
            try
            {
                if (expenseFormData == null)
                {
                    return BadRequest("Expense form data is null.");
                }

                _dbContext.ExpenseForm.Update(expenseFormData);
                await _dbContext.SaveChangesAsync();

                int expenseFormId = (int)expenseFormData.Id;
                var response = new { message = "Expense Form Status Updated", expenseFormId = expenseFormId, updatedExpenseForm = expenseFormData };

                DateOnly date = new DateOnly(DateTime.Today.Year, DateTime.Today.Month, DateTime.Today.Day);
                History historyEvent = new History("Form Status Changed", date, expenseFormId);
                _dbContext.History.Add(historyEvent);
                await _dbContext.SaveChangesAsync();

                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("/expense/form/history")]
        public IActionResult GetExpensesFormHistoryFromDb([FromQuery] int expenseFormId)
        {
            try
            {
                var expenseFormHistoryEvents = _dbContext.History
                    .Where(ef => ef.ExpenseFormId == expenseFormId)
                    .ToList();
                
                var response = new { expenseFormEvents = expenseFormHistoryEvents};
                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }
    }
}