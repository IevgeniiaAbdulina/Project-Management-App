import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {ThemePalette} from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Board } from 'src/app/features/user/models/board';
import { User } from 'src/app/features/user/models/user';
import { AuthUserService } from 'src/app/features/user/services/auth-user/auth-user.service';
import { BoardService } from 'src/app/features/user/services/board/board.service';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { ModalFormComponent } from 'src/app/shared/components/modal-form/modal-form.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public user?: User;
  public userName?: string;

  localesList = [
    { code: 'en-US', label: 'English' },
    { code: 'pl', label: 'Polski' }
  ];

  colorControl = new FormControl('accent' as ThemePalette);
  searchForm = new FormGroup({
    valueInput: new FormControl(''),
  });

  // slide-toggle
  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;

  constructor(
    public dialog: MatDialog,
    public authUserService: AuthUserService,
    public boardService: BoardService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.user = this.authUserService.userValue as User;

    setInterval(() => {
      this.userName = JSON.parse(localStorage.getItem('name')!);
    }, 1000)
  }

  onSearchSubmit() {
    this.searchForm.setValue({
      valueInput: ''
    });
  };

  // Open Modal Form Create New Board
  openDialog(): void {
    const userId = this.authUserService.userValue?._id;

    const dialogRef = this.dialog.open(ModalFormComponent, {
      data: {
        modalHeader: 'Create a new board',
        modalPlaceholder: 'Board name ...',
        boardTitle: '',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog was closed, DOARD result: ${result}`);

      const board: Board = {
        title: '',
        owner: '',
        users: []
      }


      if(!result) { return }
        board.title = result;
        board.owner = userId;
        board.users?.push(userId  ?? '');

      this.boardService.createBord(board).subscribe(() => {
        this.boardService.getBoardsByUserId(userId)
          .subscribe(boards => this.boardService.boardListSubject.next(boards))
      })
    });
  };

  // User loged out confirmation modal
  onLogOut(): void {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '250px',
      data: {innerDialogText: 'Do you want to Log out?'}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result) {
        this.authUserService.logout();
        this.boardService.boardListSubject.next(null);
      };
    })
  }

  /**
   *
   * [EDIT] Edit user profile button has been clicked
   *
   */
  onEditUserProfileClick() {
    const navigateUrl = ['users', 'profile'];
    this.router.navigate(navigateUrl);
  }
}
