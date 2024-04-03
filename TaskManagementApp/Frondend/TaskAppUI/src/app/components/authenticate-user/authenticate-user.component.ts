import { Component } from '@angular/core';

@Component({
  selector: 'app-authenticate-user',
  templateUrl: './authenticate-user.component.html',
  styleUrl: './authenticate-user.component.scss',
})
export class AuthenticateUserComponent {
  public showLoginComponent: boolean = true;

  public userSignedIn() {
    this.showLoginComponent = true;
  }
}
