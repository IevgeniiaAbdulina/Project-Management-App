import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormGroupDirective,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthUserService } from 'src/app/features/user/services/auth-user/auth-user.service';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/services/alert-service/alert-service.service';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpPageComponent implements OnInit{
  hide = true;
  public signUpForm!: FormGroup;

  constructor(
    private authUserService: AuthUserService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
  ) {}

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      login: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      password: new FormControl('',
      [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/),
      ]
      ),
    });
  };

  onSubmit(formData: FormGroup, formDirective: FormGroupDirective): void {
    this.authUserService.register(formData.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.alertMessage('Registration successful!', 'close', 'alert-success');

          this.router.navigate(['/login'], { relativeTo: this.route });
        },
        error: error => {
          this.alertService.alertMessage('Something went wrong', 'close', 'alert-error');
        }
      })

    formDirective.resetForm();
    this.signUpForm.reset();
  }
}
