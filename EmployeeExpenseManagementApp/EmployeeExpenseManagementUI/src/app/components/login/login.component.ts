import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Route, Router } from '@angular/router';
import { UserInformationObject } from '../../dtos/UserInformationObject';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  public username: string = '';
  public password: string = '';
  public error: boolean = false;
  public errorMessage: string = '';

  constructor(
    private readonly apiService: ApiService,
    private readonly router: Router
  ) {}

  ngOnInit() {}

  public onLoginSubmit() {
    this.error = false;

    if (this.username.length < 1 || this.password.length < 1) {
      this.error = true;
      this.errorMessage = 'Please Enter Valid Username and Password';
      return;
    }
    const data = { username: this.username, password: this.password };

    this.apiService.loginUser(data).subscribe(
      (response) => {
        console.log(response);

        this.apiService.userInformationObject = {
          message: response['message'],
          role: response['role'],
          userId: response['userId'],
          userName: response['userName'],
          employeeInfo: {
            id: response['employeeInfo'][0]['id'],
            name: response['employeeInfo'][0]['name'],
            designation: response['employeeInfo'][0]['designation'],
            managerId: response['employeeInfo'][0]['managerId'],
            aspNetUserId: response['employeeInfo'][0]['aspNetUserId'],
          },
        };
        this.apiService.userNameAndRole.next({
          userName: response['userName'],
          userRole: response['role'],
        });
        this.apiService.isUserAuthenticated.next(true);
        this.apiService.initAuthTableOptions(response['role']);
        this.apiService.showMenuBar.next(true);
        this.router.navigate(['/displayExpenseForms']);
      },
      (error) => {
        this.error = true;
        this.errorMessage = 'Login Failed';
      }
    );
  }
}
