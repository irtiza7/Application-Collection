import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { UserDTO } from '../../dtos/UserDTO';
import { ToastrService } from 'ngx-toastr';
import { TaskDTO } from '../../dtos/TaskDTO';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {
  public newTask = {
    title: '',
    description: '',
  };
  public errorMessage: string = '';

  private userId: number | null = null;
  private sub: Subject<void> = new Subject<void>();

  constructor(
    private readonly apiService: ApiService,
    private readonly taskService: TaskService,
    private readonly router: Router,
    private readonly toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.taskService.loggedInUser
      .pipe(takeUntil(this.sub))
      .subscribe((userData: UserDTO | null) => {
        if (userData && userData.id) {
          this.userId = userData.id;
        }
      });
  }

  public addTask() {
    const taskData = {
      title: this.newTask.title,
      description: this.newTask.description,
      status: 'Pending',
      userId: this.userId,
    };
    this.apiService
      .addTask(taskData)
      .pipe(takeUntil(this.sub))
      .subscribe((response: any) => {
        if (response['errorFlag']) {
          this.errorMessage = response['message'];
          this.toastrService.error(response['message']);
          return;
        }

        this.errorMessage = '';
        const taskData: TaskDTO = response['dataValues'];
        this.toastrService.success(response['message']);
      });
  }
}
