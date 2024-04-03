import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-container',
  templateUrl: './task-container.component.html',
  styleUrl: './task-container.component.scss',
})
export class TaskContainerComponent {
  constructor(private readonly router: Router) {}

  ngOnInit() {
    this.openTaskListComponent();
  }

  public openAddTaskComponent() {
    this.router.navigate(['api/task/dashboard/add']);
  }

  public openTaskListComponent() {
    this.router.navigate(['api/task/dashboard/list']);
  }
}
