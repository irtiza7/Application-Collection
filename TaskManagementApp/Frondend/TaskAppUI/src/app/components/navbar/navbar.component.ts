import { Component, Input } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { UserDTO } from '../../dtos/UserDTO';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @Input({ required: true }) navbarHeading: any = 'Navbar Heading';

  public userName: string = '';
  public showLogoutButton: boolean = false;

  private sub: Subject<void> = new Subject<void>();

  constructor(
    private readonly apiService: ApiService,
    private readonly taskService: TaskService,
    private readonly router: Router
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
      .subscribe((userInformation: UserDTO | null) => {
        if (userInformation) {
          this.userName = userInformation.name;
          this.showLogoutButton = true;
        }
      });
  }

  public logoutClicked() {
    this.userName = '';
    this.showLogoutButton = false;
    this.router.navigate(['/']);
  }
}
