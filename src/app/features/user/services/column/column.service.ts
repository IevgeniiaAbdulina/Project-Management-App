import { Injectable } from '@angular/core';
import { ColumnItem } from '../../models/column';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AlertService } from 'src/app/shared/services/alert-service/alert-service.service';

@Injectable({
  providedIn: 'root'
})
export class ColumnService {
  public columnListSubject: BehaviorSubject<ColumnItem[] | null>;
  public columnList: Observable<ColumnItem[] | null>;

  public columnSubject: BehaviorSubject<ColumnItem | null>;
  public column: Observable<ColumnItem | null>;

  constructor(
    private http: HttpClient,
    private alertService: AlertService

  ) {
    this.columnListSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('columns')!));
    this.columnList = this.columnListSubject.asObservable();

    this.columnSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('column')!));
    this.column = this.columnSubject.asObservable();
  }

  public get columnListValue() {
    return this.columnListSubject.value;
  }

  public get columnValue() {
    return this.columnListSubject.value;
  }

  updateColumnOnPage(boardId: string, columnId: string, column: any) {
    this.updateColumnById(boardId, columnId, column).subscribe((column) => {
      this.columnSubject.next(column);
    })
  }

  /***
   *
   * Updates orders according to item position,
   * starting from 0
   */

  // updates orders according to item position, starting from 0
  updateOrders(items: ColumnItem[]): ColumnItem[] {
    let index = 0;

    return items.map((item) => {
      item.order = index;
      index++;
      return item;
    });
  }
  // ----------------------------

  /**
   *
   * DELETE Column and update page
   * ----------------------------
   */

    onDeleteColumnUpdatePage(boardId: string, columnId: string) {
      this.deleteColumnById(boardId, columnId).subscribe({
        next: (res) => {
          this.alertService.alertMessage('Column has been deleted', 'close', 'alert-success');

          const columnSet = this.columnListValue?.filter(col => col._id !== res._id) ?? [];
          const updatedColumnSet = this.updateOrders(columnSet);

          this.updateSetOfColumns(updatedColumnSet);
        },
        error: err => {
          console.log(err)
          this.alertService.alertMessage('Cannot delete this column', 'close', 'alert-error');
        }
      })
    }
    // ----------------------------

  // Columns
  // API for columns
  //---------------------------------


  // GET
  // /boards/{boardId}/columns
  // Get Columns in Board
  getColumnsInBoard(boardId: string) {
    return this.http.get<ColumnItem[]>(`boards/${boardId}/columns`)
    .subscribe( columns => {
        console.log('RESPONSE getColumnsInBoard COLUMN: ', columns)
      columns.sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0));
      this.columnListSubject.next(columns);
    })
  }

  // POST
  // /boards/{boardId}/columns
  // Create Column
  createColumn(boardId: string, column: ColumnItem) {
    return this.http.post<ColumnItem>(`boards/${boardId}/columns`, column);
  }

  // GET
  // /boards/{boardId}/columns/{columnId}
  // Get Column by Id
  getColumnById(boardId: string, columnId: string) {
    return this.http.get<ColumnItem>(`boards/${boardId}/columns/${columnId}`);
  }

  // PUT
  // /boards/{boardId}/columns/{columnId}
  // Update Column by Id
  updateColumnById(boardId: string, columnId: string, column: any) {
    return this.http.put<ColumnItem>(`boards/${boardId}/columns/${columnId}`, column);
  }

  // DELETE
  // /boards/{boardId}/columns/{columnId}
  // Delete Column by Id
  deleteColumnById(boardId: string, columnId: string) {
    return this.http.delete<ColumnItem>(`boards/${boardId}/columns/${columnId}`);
  }

  // GET
  // /columnsSet
  // Get Columns by ids list or UserId
  getColumnsByIdsListOrUserId(columnIdList: [string], userId: string) {
    return this.http.get<ColumnItem[]>('columnsSet')
      .pipe(map(columns => {
        console.log('Get Columns by Ids List or UserId', columns);
        if(columnIdList) {
          columnIdList.forEach(columnId => {
            columns.filter(col => col._id === columnId);
          })
        } else if(userId) {
          columns.filter(col => col._id === userId);
        }
      })).subscribe(column => {
        console.log('Get Column By Ids or User id: ', column)
      })
  }

  // PATCH
  // /columnsSet
  // Update set of Columns
  updateSetOfColumns(columnList: ColumnItem[]) {
    let requestBody = columnList.map(column => {
      return {
        _id: column._id,
        order: column.order
      }
    });

    this.http.patch<any[]>('columnsSet', requestBody)
      .subscribe( columns => {
        this.columnListSubject.next(columns);
      })
  }

  // POST
  // /columnsSet
  // Create set of Columns
  createSetOfColumns(columns: ColumnItem[]) {
    return this.http.post<ColumnItem[]>('columnsSet', columns);
  }
}
