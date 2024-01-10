import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app/app.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  showLoginForm: boolean = false;
  formLogin!: FormGroup;
  handleButtonClick(event: Event) {
    event.stopPropagation();
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.formLogin = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
    this.appService.showLogginForm.subscribe((res: any): any => {
      this.showLoginForm = res;
    })
  }

  onLogin(): any {
    if (this.formLogin.invalid) {
      return Swal.fire({
        title: 'Error!',
        text: 'Please check your email and password again!',
        icon: 'error',
        confirmButtonText: 'OK'
      }).then((result): any => {
        if (result.isConfirmed) {
          return false;
        }
      })
    }

    this.authService.login(this.formLogin.value).subscribe((res: any): any => {
      if (res.status) {
        // console.log(res.userData)
        //save token to local storage
        localStorage.setItem('token', res.accessToken);
        this.appService.sendStatusShowLoginForm(false);
        this.appService.sendUserData(res);
        window.location.reload();
        this.router.navigate(['/home']);
      } else {
        return Swal.fire({
          title: 'Error!',
          text: 'Password or email is incorrect!',
          icon: 'error',
          confirmButtonText: 'OK'
        }).then((result): any => {
          if (result.isConfirmed) {
            return false;
          }
        })
      }
    })
  }

  register(): any {
    this.router.navigate(['/register']);
    this.showLoginForm = false;
  }

  backToHome(): any {
    this.router.navigate(['/home']);
    this.showLoginForm = false;
  }
}
