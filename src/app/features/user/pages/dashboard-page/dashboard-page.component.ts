import { Component, OnInit } from '@angular/core';
import { BoardService } from '../../services/board/board.service';
import { Board } from '../../models/board';
import { Router } from '@angular/router';
import { ColumnService } from '../../services/column/column.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit {
  public boardList?: Board[]
  private user?: User;

  constructor(
    public boardService: BoardService,
    private columnService: ColumnService,
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
    this.user = this.loadFromLocalStorage('user');

    this.boardService.boardList.subscribe(boards => {
      this.boardList = boards ?? [];
    });

    this.boardService.getBoardsByUserId(this.user?._id).subscribe(boards => {
      this.boardList = boards;
      this.boardService.boardListSubject.next(boards);
    });
  }

  onBoardCardClick(item: Board) {
    const boardId = item._id ?? '';
    this.columnService.getColumnsInBoard(boardId);

    const navigateUrl = ['users', 'boards', boardId]
    this.router.navigate(navigateUrl);
  }
}
