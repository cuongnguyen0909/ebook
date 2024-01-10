import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './services/app/app.service';
import { AuthService } from './services/auth/auth.service';
import { UserService } from './services/user/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  userData!: any;
  isLoggin: boolean = false;
  constructor(
    private router: Router,
    private appService: AppService,
    private userService: UserService
  ) {
    // const token = localStorage.getItem('token');
    // const name = localStorage.getItem('name');
    // if (token && name) {
    //   this.isLoggin = true;
    //   this.userData = name
    // }
    if (localStorage.getItem('token')) {
      this.userService.getCurrentUser().subscribe((res: any): any => {
        if (res.status) {
          // this.isLoggin = true;
          this.userData = res.user.name;
        }
      })
    }

  }

  ngOnInit(): void {
    // this.appService.userData.subscribe((userData: any) => {
    //   this.userData = userData;
    // });
  }


  logout() {
    localStorage.removeItem('token');
    this.isLoggin = false;
    window.location.reload();
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  redirectToHome() {
    this.router.navigate(['/home']);
  }

  handleButtonClick(event: Event) {
    event.stopPropagation();
  }

  redirectToBooksByGenres() {
    this.router.navigate(['/books-by-genres']);
  }

  toggleLogin() {
    // const space = document.querySelector('.space') as HTMLElement;
    // space.classList.add('active');
    this.appService.sendStatusShowLoginForm(true);
    // console.log(this.showLogginForm)
  }


}
