using ExpenseAPI.Data;
using ExpenseAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace ExpenseAPI.Controllers
{
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;

        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly DataContextEF _dbContext;

        public AuthController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, DataContextEF dbContext)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _dbContext = dbContext;
        }

        [HttpPost]
        [Route("/register")]
        public async Task<IActionResult> registerUser([FromBody] RegisterUser regUser)
        {
            var user = new IdentityUser
            {
                UserName = regUser.Username,
                Email = regUser.EmailAddress,
            };

            var result = await _userManager.CreateAsync(user, regUser.Password);
            if (result.Succeeded)
            {
                await _signInManager.SignInAsync(user, isPersistent: false);
                return Ok("Reistered Successfully");
            }
            else
            {
                using StreamWriter file = new("log.txt", append: true);
                string now = DateTime.Now.ToString("yyyy MM dd HH mm ss");
                file.WriteLine("----\n" + "Error in /register route, occurred at " + $"{now}" + $"\nError: [{result.Errors}]" + "\n----");
                file.Close();

                return BadRequest(result.Errors);
            }

        }

        [HttpPost]
        [Route("/login")]
        public async Task<IActionResult> Login([FromBody] LoginUser loginUser)
        {
            var result = await _signInManager.PasswordSignInAsync(
                loginUser.Username, loginUser.Password, false, false);

            if (result.Succeeded)
            {
                var role = "";
                if (User.IsInRole("Manager"))
                {
                    role = "Manager";
                }
                else if (User.IsInRole("Employee"))
                {
                    role = "Employee";
                }
                else if (User.IsInRole("Accountant"))
                {
                    role = "Accountant";
                }
                else if (User.IsInRole("Admin"))
                {
                    role = "Admin";
                }

                var user = await _userManager.FindByNameAsync(loginUser.Username);
                var employeeInfo = await _dbContext.GetEmployeesByAspNetUserIdAsync(user.Id);

                var response = new {
                    role = role,
                    message = "Login Successfull",
                    userId = user.Id,
                    userName = user.UserName,
                    employeeInfo = employeeInfo
                };

                return Ok(response);
            }
            else
            {
                using StreamWriter file = new("log.txt", append: true);
                string now = DateTime.Now.ToString("yyyy MM dd HH mm");
                file.WriteLine("----\n" + "Error in /login, occurred at " + $"{now}" + "\n" + "\n----");
                file.Close();

                return BadRequest(new { error = result });
            }
        }
    }
}
