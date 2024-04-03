import { Injectable } from '@angular/core';
import { UserDTO } from '../dtos/UserDTO';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  public loggedInSuccessFlag: boolean = false;
  public loggedInUser: BehaviorSubject<UserDTO | null> =
    new BehaviorSubject<UserDTO | null>(null);

  constructor() {}
}
