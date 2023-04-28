import { Component, Input, OnInit } from '@angular/core';

import { TaskItem } from '../../models/task';
import { ColumnItem, ColumnTitle } from '../../models/column';
import { ModalFormComponent } from 'src/app/shared/components/modal-form/modal-form.component';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';

import { TaskService } from '../../services/task/task.service';
import { AuthUserService } from '../../services/auth-user/auth-user.service';
import { ColumnService } from '../../services/column/column.service';
import { AlertService } from 'src/app/shared/services/alert-service/alert-service.service';

import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  @Input() column?: ColumnItem;

  columnList: ColumnItem[] = this.columnService.columnListValue ?? []
  taskList: TaskItem[] = [];

  formColumnTitle: FormGroup;
  isEdited = false;

  columnTitle = this.column?.title;
  boardId = '';
  columnId = '';

  private counterOrder = 0;

  constructor(
    public dialog: MatDialog,
    private taskService: TaskService,
    private userService: AuthUserService,
    private columnService: ColumnService,
    private alertService: AlertService
  ) {
    this.formColumnTitle = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
      ]),
    });
  }

  ngOnInit(): void {
    this.boardId = this.column?.boardId ?? '';
    this.columnId = this.column?._id ?? '';

    this.formColumnTitle.setValue({
      title: this.column?.title
    })

    this.taskService.dataHasBeenFetched.subscribe(() => {
      this.taskList = this.taskService.tasksMap.get(this.columnId) ?? [];
    });

    this.getTasks();
    this.formColumnTitle.controls['title'].disable();
  }

  /**
   *
   * EDIT Column Title
   * ----------------------------
   */

  onEditBtnClick() {
    this.isEdited = true;
    this.formColumnTitle.controls['title'].enable();
    this.columnTitle = this.formColumnTitle.controls['title'].value;
  }

  onFormSubmit(event: any) {
    this.isEdited = false;
    event.preventDefault();

    const updatedColumn = {
      title: this.inputValue.title,
      order: this.column?.order
    }

    this.columnService.updateColumnOnPage(
      this.column?.boardId ?? '',
      this.column?._id ?? '',
      updatedColumn)

    this.isEdited = false;
    this.formColumnTitle.controls['title'].disable();
  }

  onFormClose() {
    this.isEdited = false;
    this.formColumnTitle?.controls['title'].setValue(this.columnTitle);
    this.formColumnTitle.controls['title'].disable();
  }

  /**
   *
   * DELETE Column
   * ----------------------------
   */
  onDeleteColumn() {
    if(!this.column) return;

    this.dialog.open(ConfirmationModalComponent, {
      data: {
        innerDialogText: 'Are you sure want to delete this column?',
      }
    }).afterClosed().subscribe(result => {
      if(result) {
        this.columnService.onDeleteColumnUpdatePage(this.column?.boardId ?? '', this.column?._id ?? '')
      }
    });
  }

  /**
   *
   * CREATE Task
   * ----------------------------
   */
  onCreateTask() {
    const userId = this.userService.userValue?._id;

    if(!userId) { return }
    const users: [string] = [userId];

    this.openDialogCreateTask().subscribe((result) => {
      if(!result) return;

      const newTask = {
        title: result,
        order: this.counterOrder,
        description:	'Description',
        userId:	userId,
        users: users
      }
      this.taskService.createTask(this.boardId, this.columnId, newTask)
        .subscribe({
          next: () => {
            this.alertService.alertMessage('Task has been created', 'close', 'alert-success');
            this.getTasks()
          },
          error: err => {
            console.error(err);
            this.alertService.alertMessage('Something went wrong!', 'close', 'alert-error')
          }
        })
    })

    this.counterOrder++;
  }

  openDialogCreateTask(): Observable<any> {
    const dialogRef = this.dialog.open(ModalFormComponent, {
      data: {
        modalHeader: 'Create new task',
        modalPlaceholder: 'Task name ...',
        inputValue: '',
      }
    });

    return dialogRef.afterClosed();
  }

  /**
   *
   * Drag & Drop tasks
   *
   * updates orders according to item position,
   * starting from 0
   */
  updateTasksOrders(items: TaskItem[]): TaskItem[] {
    let index = 0;

    return items.map((item) => {
      item.order = index;
      index++;
      return item;
    });
  }

  /**
   *
   * Update Task Map
   *
   */
    updateTaskMap() {
      const tasksMap = this.taskService.tasksMap.entries();

      for(let [columnId, tasks] of tasksMap) {
        let sortedTasks = this.updateTasksOrders(tasks)
        this.taskService.tasksMap.set(columnId, sortedTasks);
      }
    }

  dropItem(event: CdkDragDrop<TaskItem[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      const updatedTask = {
        title: event.item.data.title,
        order: event.currentIndex,
        columnId: event.container.id,
        description: event.item.data.description,
        userId: event.item.data.userId,
        users: event.item.data.users,
      };

      this.taskService.updateTaskById(
        this.boardId,
        event.container.id,
        event.item.data._id,
        updatedTask).subscribe((resp) => {
          this.updateTaskMap();
          this.taskService.updateSetOfTasks();
        })
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      const updatedTask = {
        title: event.item.data.title,
        order: event.currentIndex,
        columnId: event.container.id,
        description: event.item.data.description,
        userId: event.item.data.userId,
        users: event.item.data.users,
      };

      this.taskService.updateTaskById(
        this.boardId,
        event.container.id,
        event.item.data._id,
        updatedTask).subscribe((resp) => {
          this.updateTaskMap();
          this.taskService.updateSetOfTasks();
        })
    }
  }

  /**
   *
   * Update columnList map
   * ----------------------------
   */
  getConnectedList(): any[] {
    return this.columnList.map(x => `${x._id}`)
  }

  /**
   *
   * GET inputValue
   * ----------------------------
   */
  private get inputValue(): ColumnTitle {
    return this.formColumnTitle?.value;
  }

  /**
   *
   * GET Tasks
   * ----------------------------
   */
  private getTasks(boardId: string = this.boardId, columnId: string = this.columnId) {
    this.taskService.getTasksInColumn(boardId, columnId)
  }
}
