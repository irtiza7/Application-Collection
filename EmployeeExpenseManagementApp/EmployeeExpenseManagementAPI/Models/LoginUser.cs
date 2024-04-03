using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace ExpenseAPI.Models
{
    public class LoginUser
    {
        public LoginUser() {
            this.EmailAddress = "";
            this.Password = "";
            this.Username = "";
        }

        [JsonProperty("username")]
        public string Username { get; set; }

        [JsonProperty("emailAddress")]
        public string EmailAddress { get; set; }

        [JsonProperty("password")]
        [Required]
        public string Password { get; set; }
    }
}
