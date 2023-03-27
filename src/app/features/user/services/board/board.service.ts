import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Board } from '../../models/board';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class BoardService {
  public boardListSubject: BehaviorSubject<Board[] | null>;
  public boardList: Observable<Board[] | null>;

  public boardSubject: BehaviorSubject<Board | null>;
  public board: Observable<Board | null>;

  constructor(
    private http: HttpClient,
  ) {
    this.boardListSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('boards')!));
    this.boardList = this.boardListSubject.asObservable();

    this.boardSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('board')!));
    this.board = this.boardSubject.asObservable();
  }

  public get boardListValue() {
    return this.boardListSubject.value;
  }

  public get boardValue() {
    return this.boardSubject.value;
  }

  /**
   *
   * DELETE Board
   * ----------------------------
   */
    deleteBoardUpdatePage(boardId: string) {
      this.deleteBoardById(boardId).subscribe(resp => {
        const boardsSet = this.boardListValue?.filter(board => board._id !== resp._id);
        this.boardListSubject.next(boardsSet ?? [])
      })
    }

  // ----------------------------


  // GET
  // /boards
  // Get all Boards
  getAllBoards() {
    return this.http.get<Board[]>('boards');
  }

  // POST
  // /boards
  // Create Board
  createBord(board: Board) {
    return this.http.post<Board>('boards', board);
  }

  // GET
  // /boards/{boardId}
  // Get Board by Id
  getBoardById(boardId: string) {
    return this.http.get<Board>(`boards/${boardId}`)
    .pipe(map(board => {
      localStorage.setItem('board', JSON.stringify(board));
      this.boardSubject.next(board);

      return board;
    }))
  }

  // PUT
  // /boards/{boardId}
  // Update Board by Id
  updateBoardById(boardId: string, board: Board) {
    return this.http.put<Board>(`boards/${boardId}`, board);
  }

  // DELETE
  // /boards/{boardId}
  // Delete Board by Id
  deleteBoardById(boardId: string) {
    return this.http.delete<Board>(`boards/${boardId}`);
  }

  // GET
  // /boardsSet
  // Get Boards by ids list
  getBoardsBuIdsList(idList: [string]) {
    return this.http.get<Board[]>('boardsSet');
  }

  // GET
  // /boardsSet/{userId}
  // Get Boards by userId
  getBoardsByUserId(userId?: string) {
    return this.http.get<Board[]>(`boardsSet/${userId}`);
  }

}
