import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { UserDTO } from '../../dtos/UserDTO';
import { TaskService } from '../../services/task.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  @Output() userSignedIn: EventEmitter<boolean> = new EventEmitter();

  public signupData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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
      name: this.signupData.name,
      email: this.signupData.email,
      password: this.signupData.password,
    };

    this.apiService
      .signupUser(userData)
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
        this.userSignedIn.emit(true);
      });
  }
}
