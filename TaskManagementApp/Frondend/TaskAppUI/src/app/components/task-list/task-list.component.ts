import { Component } from '@angular/core';
import { TaskDTO } from '../../dtos/TaskDTO';
import { ApiService } from '../../services/api.service';
import { TaskService } from '../../services/task.service';
import { UserDTO } from '../../dtos/UserDTO';
import { Subject, take, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  public userTasksLisit: TaskDTO[] = [];

  private userId: number | null = null;
  private sub: Subject<void> = new Subject();

  constructor(
    private readonly apiService: ApiService,
    private readonly taskService: TaskService,
    private readonly toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.initFields();
  }

  ngOnDestroy() {
    this.sub.next();
    this.sub.complete();
  }

  private initFields() {
    this.taskService.loggedInUser
      .pipe(takeUntil(this.sub))
      .subscribe((userData: UserDTO | null) => {
        if (userData) {
          this.userId = userData.id;
          this.fetchUserTasks(this.userId!);
        }
      });
  }

  private fetchUserTasks(userId: number) {
    this.apiService
      .getAllTasks({ id: userId })
      .pipe(takeUntil(this.sub))
      .subscribe((response: any) => {
        this.userTasksLisit = response;
      });
  }

  public deleteTask(taskId: number) {
    const taskData = { id: taskId };
    this.apiService
      .deleteTask(taskData)
      .pipe(takeUntil(this.sub))
      .subscribe((response: any) => {
        this.toastrService.success(response['message']);
        this.fetchUserTasks(this.userId!);
      });
  }

  public updateTask(taskData: TaskDTO) {
    this.apiService
      .editTask(taskData)
      .pipe(takeUntil(this.sub))
      .subscribe((response: any) => {
        this.toastrService.success(response['message']);
        this.fetchUserTasks(this.userId!);
      });
  }
}
