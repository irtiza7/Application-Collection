import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { TaskService } from '../../services/task.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { UserDTO } from '../../dtos/UserDTO';
import { Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public loginData = {
    email: '',
    password: '',
  };
  public errorMessage: string = '';

  private sub: Subject<void> = new Subject<void>();

  constructor(
    private readonly apiService: ApiService,
    private readonly taskService: TaskService,
    private readonly toastrService: ToastrService,
    private readonly router: Router
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.sub.next();
    this.sub.complete();
  }

  public onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const userData = {
      email: this.loginData.email,
      password: this.loginData.password,
    };

    this.apiService
      .loginUser(userData)
      .pipe(takeUntil(this.sub))
      .subscribe((response: any) => {
        if (response['errorFlag']) {
          this.errorMessage = response['message'];
          this.toastrService.error(response['message']);
          return;
        }

        this.errorMessage = '';
        const userData: UserDTO = response['dataValues'];
        this.taskService.loggedInUser.next(userData);
        this.toastrService.success(response['message']);
        this.router.navigate(['/api/task/dashboard']);
      });
  }
}
