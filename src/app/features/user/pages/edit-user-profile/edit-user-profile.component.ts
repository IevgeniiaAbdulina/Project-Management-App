import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { User } from '../../models/user';
import { AuthUserService } from '../../services/auth-user/auth-user.service';
import { FormValidationService } from '../../services/form-validation/form-validation.service';

@Component({
  selector: 'app-edit-user-profile',
  templateUrl: './edit-user-profile.component.html',
  styleUrls: ['./edit-user-profile.component.scss']
})
export class EditUserProfileComponent implements OnInit {
  hide = true;
  public user?: User;
  public userProfileForm!: FormGroup;

  constructor(
    public dialog: MatDialog,
    private location: Location,
    private authUserService: AuthUserService,
    private formValidator: FormValidationService
  ) {}

  ngOnInit(): void {
    this.user = this.authUserService.userValue as User;

    this.user = JSON.parse(localStorage.getItem('user')!);

    // LOAD Form Group
    // -----------------------------
    this.userProfileForm = new FormGroup({
      name: new FormControl(this.user?.name, [
        Validators.required,
        Validators.minLength(4),
      ]),
      login: new FormControl(this.user?.login, [
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.required,
        this.passwordCustomValidator
      ]),

    });
  };

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

  getErrorsPassword() {
    const passwordErrors = this.userProfileForm.get('password')?.errors;
    return passwordErrors?.['required'] ?
      'Password is required.' :
      passwordErrors?.['requirements'] ?
      'Password must be a combination of lower-case, upper-case, numbers and at least eight characters long.' : '';
  }

  checkValidation(input: string) {
    const validation = this.userProfileForm.get(input)?.invalid && (this.userProfileForm.get(input)?.dirty || this.userProfileForm.get(input)?.touched);
    return validation;
  }


  /**
   *
   * [CANCEL] Edit user profile
   *
   */
  onCancel() {
    this.location.back();
  }


  /**
   *
   * [EDIT] Edit user profile
   *
   */
  onSubmit() {
    const updatedUserData = {
      name: this.userProfileForm.value.name,
      login: this.userProfileForm.value.login,
      password: this.userProfileForm.value.password,
    }

    if(this.user !== null && this.user !== undefined) {
      this.authUserService.updateUserById(this.user?._id ?? '', updatedUserData)
        .subscribe(user => {
          console.log('Get updated user', user)
          this.authUserService.loadUser(user);
          this.location.back();
        })
    }
  }


  /**
   *
   * [DELETE] Delit user
   *
   */
  onDeleteProfile(): void {
    if(!this.user) return;
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: {innerDialogText: 'Do you want to delete Your account?'}
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.authUserService.deleteUser(this.user?._id ?? '').subscribe(() => {
        console.log('User has been REMOVED from DB');
      })
    })
  }
}
