import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private REST_API_SERVER = 'http://localhost:3000/api/v1/auth/';
  public userData = new BehaviorSubject<any>(null);
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  }
  constructor(
    private httpClient: HttpClient,
  ) { }

  login(data: any): Observable<any> {
    return this.httpClient.post(this.REST_API_SERVER + 'login', data, this.httpOptions)
  }

  register(data: any): Observable<any> {
    return this.httpClient.post(this.REST_API_SERVER + 'register', data, this.httpOptions)
  }

  finalRegister(token: any): Observable<any> {
    return this.httpClient.put(`${this.REST_API_SERVER}/finalRegister/${token}`, this.httpOptions)
  }
}
