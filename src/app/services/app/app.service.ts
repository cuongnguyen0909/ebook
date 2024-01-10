import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  public showLogginForm = new BehaviorSubject<boolean>(false);
  public userData = new BehaviorSubject<any>(null);
  constructor(
    private router: Router
  ) { }

  public sendStatusShowLoginForm(isShowLoginForm: boolean) {
    this.showLogginForm.next(isShowLoginForm);
  }

  public sendUserData(data: any) {
    this.userData.next(data);
  }

  public removeData() {
    localStorage.removeItem('token');
  }

  public isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

}
