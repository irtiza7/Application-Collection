import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskDTO } from '../../dtos/TaskDTO';

@Component({
  selector: 'app-individual-task',
  templateUrl: './individual-task.component.html',
  styleUrl: './individual-task.component.scss',
})
export class IndividualTaskComponent {
  @Input() task!: TaskDTO;

  @Output() markAsDoneEvent = new EventEmitter<TaskDTO>();
  @Output() deleteTaskEvent = new EventEmitter<number>();
  @Output() updateTaskEvent = new EventEmitter<TaskDTO>();

  public isEditing: boolean = false;

  constructor() {}

  public markTaskAsDone() {
    this.task.status = 'Done';
    this.markAsDoneEvent.emit(this.task);
  }

  public deleteTask() {
    this.deleteTaskEvent.emit(this.task.id!);
  }

  public editTask() {
    this.isEditing = true;
  }

  public updateTask() {
    this.isEditing = false;
    this.updateTaskEvent.emit(this.task);
  }

  public cancelChanges() {
    this.isEditing = false;
  }
}
