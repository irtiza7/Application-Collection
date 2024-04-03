using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace ExpenseAPI.Models
{
    public class RegisterUser
    {
        public RegisterUser() {
            this.EmailAddress = "";
            this.Password = "";   
            this.ConfirmPassword = "";
            this.Username = "";
        }

        [JsonProperty("username")]
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; }

        [JsonProperty("emailAddress")]
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress]
        public string EmailAddress { get; set; }

        [JsonProperty("password")]
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [JsonProperty("confirmPassword")]
        [DataType(DataType.Password)]
        [Display(Name = "Confirm Password")]
        [Compare("Password", ErrorMessage = "Password and Confirmation password does not match.")]
        public string ConfirmPassword { get; set; }
    }
}
