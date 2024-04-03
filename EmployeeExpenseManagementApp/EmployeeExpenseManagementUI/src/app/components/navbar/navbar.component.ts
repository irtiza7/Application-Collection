import { Component, Input } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @Input({ required: true }) navbarHeading: any = 'Navbar Heading';

  public userName: string = '';
  public userRole: string = '';

  constructor(
    private readonly apiService: ApiService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.initFields();
  }

  private initFields() {
    this.apiService.userNameAndRole.subscribe((info) => {
      this.userName = info?.userName;
      this.userRole = info?.userRole;
    });
  }

  public logoutClicked() {
    this.apiService.showMenuBar.next(false);
    this.apiService.userNameAndRole.next({ userName: '', userRole: '' });
    this.router.navigate(['/']);
  }
}
