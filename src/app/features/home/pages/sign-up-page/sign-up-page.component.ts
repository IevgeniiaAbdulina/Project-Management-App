import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ValidationErrors,
  AbstractControl,
  FormGroupDirective
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthUserService } from 'src/app/features/user/services/auth-user/auth-user.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.scss']
})
export class SignUpPageComponent implements OnInit{
  hide = true;
  public signUpForm!: FormGroup;

  constructor(
    private authUserService: AuthUserService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      login: new FormControl('', Validators.required ),
      password: new FormControl('', [
        Validators.required,
        this.passwordCustomValidator
      ]),
    });
  };

  get f() { return this.signUpForm.controls };

  getErrorsName() {
    const nameErrors = this.signUpForm.get('name')?.errors;
    return nameErrors?.['required'] ?
      'Name is required.' :
      nameErrors?.['minlength'] ?
      'Name must be at least 4 characters long.' : '';
  }

  passwordCustomValidator(control: AbstractControl): ValidationErrors | null {
    let enteredPassword = control.value;
    let passwordPattern =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return (!passwordPattern.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  }

  getErrorsPassword() {
    const passwordErrors = this.signUpForm.get('password')?.errors;
    return passwordErrors?.['required'] ?
      'Password is required.' :
      passwordErrors?.['requirements'] ?
      'Password must be a combination of lower-case, upper-case, numbers and at least eight characters long.' : '';
  }

  checkValidation(input: string) {
    const validation = this.signUpForm.get(input)?.invalid && (this.signUpForm.get(input)?.dirty || this.signUpForm.get(input)?.touched);
    return validation;
  }

  onSubmit(formData: FormGroup, formDirective: FormGroupDirective): void {
    console.log('Sign Up submited');

    this.authUserService.register(formData.value)
      .pipe(first())
      .subscribe({
        next: () => {
          // console.log('REGISTER RESPONCE: ',value);
          // this.authUserService.saveUser(value);

          this.router.navigate(['/login'], { relativeTo: this.route });
        },
        error: error => {
          console.error('Error', error);
        }
      })

    formDirective.resetForm();
    this.signUpForm.reset();
  }
}
