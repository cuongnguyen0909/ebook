import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app/app.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  isShowLoginForm: boolean = false;
  isShowRegisterForm: boolean = true;
  formRegister!: FormGroup;
  formVerifyEmail!: FormGroup;
  isVeirfyEmail: boolean = false;
  toke: String = '';
  constructor(
    private appService: AppService,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.formRegister = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(6)]],
      name: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
    })

    this.formVerifyEmail = this.fb.group({
      token: ['', Validators.required]
    })
  }


  backToLogin() {
    this.isShowLoginForm = true;
    this.appService.sendStatusShowLoginForm(this.isShowLoginForm);
  }

  backToHome() {
    this.isShowLoginForm = false;
    this.router.navigate(['/home']);
  }

  register(): any {
    console.log(this.formRegister.value)
    console.log(this.formRegister.invalid)
    console.log(this.formRegister.valid)
    this.authService.register(this.formRegister.value).subscribe((res: any): any => {
      if (res.status) {
        this.isVeirfyEmail = true;
        this.isShowRegisterForm = false;
      }
    })
  }

  verifyEmail(): any {
    console.log(this.formVerifyEmail.value)
    this.authService.finalRegister(this.formVerifyEmail.value.token).subscribe((res: any): any => {
      if (res.status) {
        this.isVeirfyEmail = false;
        this.isShowRegisterForm = false
        this.appService.sendStatusShowLoginForm(true);
        // this.router.navigate(['/login']);
      }
    })

  }

}
