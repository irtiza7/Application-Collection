import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticateUserComponent } from './components/authenticate-user/authenticate-user.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskContainerComponent } from './components/task-container/task-container.component';
import { AddTaskComponent } from './components/add-task/add-task.component';

const routes: Routes = [
  { path: '', component: AuthenticateUserComponent },
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'api/task/dashboard', component: TaskContainerComponent },
  {
    path: 'api/task/dashboard',
    component: TaskContainerComponent,
    children: [
      { path: '', redirectTo: 'tasks-list', pathMatch: 'full' },
      { path: 'list', component: TaskListComponent },
      { path: 'add', component: AddTaskComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
