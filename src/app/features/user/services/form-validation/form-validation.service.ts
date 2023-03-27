import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {
  public formGroup!: FormGroup;

  constructor() { }

  /**
   *
   * [PASSWORD VALIDATOR] Check validation
   *
   */
  passwordCustomValidator(control: AbstractControl): ValidationErrors | null {
    let enteredPassword = control.value;
    let passwordPattern =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return (!passwordPattern.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  }

  getErrorsPassword(formGroup: FormGroup) {
    const passwordErrors = this.formGroup.get('password')?.errors;
    return passwordErrors?.['required'] ?
      'Password is required.' :
      passwordErrors?.['requirements'] ?
      'Password must be a combination of lower-case, upper-case, numbers and at least eight characters long.' : '';
  }

  checkValidation(input: string, formGroup: FormGroup) {
    const validation = this.formGroup.get(input)?.invalid && (this.formGroup.get(input)?.dirty || this.formGroup.get(input)?.touched);
    return validation;
  }
}
