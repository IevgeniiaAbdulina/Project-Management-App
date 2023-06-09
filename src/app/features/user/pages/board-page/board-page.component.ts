import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { ModalFormComponent } from 'src/app/shared/components/modal-form/modal-form.component';
import { ColumnService } from '../../services/column/column.service';
import { ColumnItem } from '../../models/column';
import { BoardService } from '../../services/board/board.service';
import { Board } from '../../models/board';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-board-page',
  templateUrl: './board-page.component.html',
  styleUrls: ['./board-page.component.scss']
})
export class BoardPageComponent implements OnInit  {
  public board?: Board;
  public columnList: ColumnItem[] = [];

  countColumnOreder = 0;

  constructor(
    public dialog: MatDialog,
    private columnService: ColumnService,
    private boardService: BoardService,
    private route: ActivatedRoute,
    private location: Location,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(board => {
      console.log('ROUTE Board ---> ', board)
      this.boardService.getBoardById(board['id'])
        .subscribe(board => {
          this.board = board

          const boardId = board._id;

          if(boardId !== null && boardId !== undefined) {
            this.columnService.getColumnsInBoard(boardId)
          }
        })
    })

    this.columnService.columnList
      .subscribe(columns => this.columnList = columns ?? []);
  }

   /**
   *
   * GO BACK BUTTON
   * ----------------------------
   */
    onBackBtnClick() {
      this.columnService.columnListSubject.next(null);
      this.location.back();
    }
  /** ---------------------------- */

  /**
   *
   * DELETE Board
   * ----------------------------
   */

  onDeleteBoard(): void {
    console.log('Confirm Delete Board modal is open');
    this.dialog.open(ConfirmationModalComponent, {
      data: {
        innerDialogText: 'Do you want to delete this board?'
      }
    }).afterClosed().subscribe((result) => {
      console.log(`Confirmation result: ${result}`);

      if(result) {
        // delete a board
        this.boardService.deleteBoardUpdatePage(this.board?._id ?? '');

        // redirect to the dashboard
        this.location.back();
      }
    })
  }
  // ----------------------------

  // Open modal window with form for column creation
  createColumn(): void {
    console.log('New COLUMN create button clecked');

    const newColumn: ColumnItem = {
      title: '',
      order: this.countColumnOreder,
    }

    const dialogRef = this.dialog.open(ModalFormComponent, {
      data: {
        modalHeader: 'Create new column',
        modalPlaceholder: 'Column title ...',
        columnTitle: '',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog was closed, COLUMN result: ${result}`);

      if(!result) { return }
      newColumn.title = result;

      this.columnService.createColumn((this.board?._id ?? ''), newColumn).subscribe(column => {
          this.columnService.getColumnsInBoard(column.boardId ?? '');
        });

      this.countColumnOreder++;
    })
  }

  // updates orders according to item position, starting from 0
  updateOrders(items: ColumnItem[]): ColumnItem[] {
    let index = 0;

    return items.map((item) => {
      item.order = index;
      index++;
      return item;
    });
  }

  dropGroup(event: CdkDragDrop<ColumnItem[]>) {
    moveItemInArray(this.columnList, event.previousIndex, event.currentIndex)

    const updatedColumn = {
      title: event.item.data.title,
      order: event.currentIndex
    }

    this.columnService.updateColumnById(this.board?._id ?? '', event.item.data._id, updatedColumn)
      .subscribe((col) => {
        this.columnList = this.updateOrders(this.columnList)
        // console.log('AFTER REORDERING, SUPER NEW. REALLY: ', this.columnList)

        this.columnService.updateSetOfColumns(this.columnList)
      })
  }


}
