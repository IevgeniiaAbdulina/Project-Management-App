import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthUserService } from 'src/app/features/user/services/auth-user/auth-user.service';

import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/features/user/services/alert-service/alert-service.service';

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
      login: ['', Validators.required],
      password: ['', Validators.required],
    })

    this.authUserService.user.subscribe((u) => {
      console.log('[user] updated subject: ', u)
      if(u != null && u != undefined) {
        // get return url from query parameters or default to home page
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'users/dashboard';
        this.router.navigateByUrl(returnUrl);
      }
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls}

  errorSubmitMessage = 'Something went wrong! Check your login or password and try again.';

  onSubmit() {
    this.alertService.clear();
    if(this.loginForm.invalid) return;
    this.authUserService.login(this.f['login'].value, this.f['password'].value)
      .pipe(first())
      .subscribe({
        next: () => {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'users/dashboard';
          this.router.navigateByUrl(returnUrl);
        },
        error: error => {
          this.alertService.error(error);
        }
      })
  }
}
