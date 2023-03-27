import { Component, OnInit } from '@angular/core';
import { BoardService } from '../../services/board/board.service';
import { Board } from '../../models/board';
import { AuthUserService } from '../../services/auth-user/auth-user.service';
import { Router } from '@angular/router';
import { ColumnService } from '../../services/column/column.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {
  public boardList?: Board[]

  constructor(
    public boardService: BoardService,
    private columnService: ColumnService,
    private userService: AuthUserService,
    private router: Router,
  ) {}


  // load any value from local storage by key
  loadFromLocalStorage(key: string): any| null {
    const data = localStorage.getItem(key)
    if(data != null) {
      return JSON.parse(data)
    }
      return null
  }
  // store value to local storage by key
  storeToLocalStorage(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  ngOnInit() {
    this.boardService.boardList.subscribe(boards => {
      this.boardList = boards ?? [];
    })

    const user = this.loadFromLocalStorage('user') as User | null;
    this.userService.user.subscribe(u => {
      if(user != null) {
        this.boardService.getBoardsByUserId(u?._id).subscribe(boards => {
          this.boardService.boardListSubject.next(boards)
        })
      }
    });
  }

  onBoardCardClick(item: Board) {
    console.log('[onBoardCardClick] --> ', item._id)
    const boardId = item._id ?? '';
    this.columnService.getColumnsInBoard(boardId);

    const navigateUrl = ['users', 'boards', boardId]
    this.router.navigate(navigateUrl);
  }
}
