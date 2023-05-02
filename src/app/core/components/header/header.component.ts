import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {ThemePalette} from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { Board } from 'src/app/features/user/models/board';
import { AuthUserService } from 'src/app/features/user/services/auth-user/auth-user.service';
import { BoardService } from 'src/app/features/user/services/board/board.service';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { ModalFormComponent } from 'src/app/shared/components/modal-form/modal-form.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  public userName?: Observable<String | null>;

  public localesList: { code: string, label: string }[] = [
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

  private subscription: Subscription = new Subscription;
  private userNameSubject: Subject<String | null> = new Subject();

  constructor(
    public dialog: MatDialog,
    public authUserService: AuthUserService,
    public boardService: BoardService,
    private router: Router,
  ) {
    this.userName = this.userNameSubject.asObservable();
  }

  ngOnInit() {
    this.authUserService.user.subscribe(
      user =>  this.userNameSubject.next(user?.name ?? "")
    )

    setInterval(() => {
      let name = JSON.parse(localStorage.getItem('name')!);
      this.userNameSubject.next(name)
    }, 500)
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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

    let subscriptionDialogNeweBoard = dialogRef.afterClosed().subscribe(result => {
      const board: Board = {
        title: '',
        owner: '',
        users: []
      }

      if(!result) { return }
        board.title = result;
        board.owner = userId;
        board.users?.push(userId  ?? '');

        let subscriptionBoard = this.boardService.createBord(board).subscribe(() => {
          let subscriptionBoards = this.boardService.getBoardsByUserId(userId).subscribe(boards => this.boardService.boardListSubject.next(boards));

          this.subscription.add(subscriptionBoards);
        });
        this.subscription.add(subscriptionBoard);
    });
    this.subscription.add(subscriptionDialogNeweBoard);
  };

  // User loged out confirmation modal
  onLogOut(): void {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '250px',
      data: {innerDialogText: 'Do you want to Log out?'}
    });

    let subscriptionDialogLogOut = dialogRef.afterClosed().subscribe((result) => {
      if(result) {
        this.authUserService.logout();
        this.boardService.boardListSubject.next(null);
      };
    });
    this.subscription.add(subscriptionDialogLogOut);
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
