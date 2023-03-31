import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { User } from '../../models/user';
import { AuthUserService } from '../../services/auth-user/auth-user.service';

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
        Validators.minLength(4),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/),
      ]),

    });
  };

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
