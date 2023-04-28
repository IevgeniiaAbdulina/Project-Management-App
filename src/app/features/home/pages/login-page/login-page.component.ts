import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthUserService } from 'src/app/features/user/services/auth-user/auth-user.service';

import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/services/alert-service/alert-service.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  loginForm!: FormGroup;
  hide = true;
  submitted = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authUserService: AuthUserService,
    private alertService: AlertService,
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      login: ['', [
        Validators.required,
        Validators.minLength(4),
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/),
      ]],
    })

    this.authUserService.user.subscribe((u) => {
      if(u != null && u != undefined) {
        // get return url from query parameters or default to home page
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'users/dashboard';
        this.router.navigateByUrl(returnUrl);
      }
    });
  }

  // convenience getter for easy access to form fields
  get formFields() { return this.loginForm.controls}

  onSubmit() {
    if(this.loginForm.invalid) return;
    this.authUserService.login(this.formFields['login'].value, this.formFields['password'].value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.alertMessage('Login success!', 'close', 'alert-success');
        },
        error: error => {
          this.alertService.alertMessage('Something went wrong', 'close', 'alert-error');
          this.submitted = false;
        }
      })
  }
}
