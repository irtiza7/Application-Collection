import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:6001';

  constructor(private httpClient: HttpClient) {}

  saveCheckInStatus(checkInData: {}): Observable<any> {
    const url = `${this.baseUrl}/api/check_in`;
    return this.httpClient.post<string>(url, checkInData);
  }

  getParkingFare(checkOutData: {}): Observable<number> {
    const url = `${this.baseUrl}/api/check_out`;
    const params = new HttpParams({ fromObject: checkOutData });
    return this.httpClient.get<number>(url, { params });
  }
}
