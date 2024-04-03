import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:4201';

  constructor(private readonly httpClient: HttpClient) {}

  public signupUser(signupUserData: {}) {
    const url = `${this.baseUrl}/signup`;
    return this.httpClient.post<string>(url, signupUserData);
  }

  public loginUser(loginUserData: {}) {
    const url = `${this.baseUrl}/login`;
    return this.httpClient.post<string>(url, loginUserData);
  }

  public addTask(taskData: {}) {
    const url = `${this.baseUrl}/api/task/add`;
    return this.httpClient.post<string>(url, taskData);
  }

  public editTask(taskData: {}) {
    const url = `${this.baseUrl}/api/task/edit`;
    return this.httpClient.post<string>(url, taskData);
  }

  public deleteTask(taskData: {}) {
    const url = `${this.baseUrl}/api/task/delete`;
    return this.httpClient.post<string>(url, taskData);
  }

  public getAllTasks(userData: {}) {
    const url = `${this.baseUrl}/api/task/list`;
    return this.httpClient.post<string>(url, userData);
  }
}
