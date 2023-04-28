import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TaskItem } from '../../models/task';
import { TaskService } from '../../services/task/task.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalEditTaskComponent } from 'src/app/shared/components/modal-edit-task/modal-edit-task/modal-edit-task.component';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { ModalFormResult } from 'src/app/features/interfaces/modal-form-result';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemComponent {
  @Input() task?: TaskItem;

  constructor(
    public dialog: MatDialog,
    private taskService: TaskService,
  ) {}

  onEditTaskItem(task: TaskItem) {
    const dialogRef = this.dialog.open(ModalEditTaskComponent, {
      data: {
        modalHeader: 'Edit current task',
        title: task.title,
        description: task.description,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      const modalResult = result as ModalFormResult

      if(modalResult.result === 'edit') {
        const updatedTask = {
          title: modalResult.payload?.title,
          order: task.order,
          description: modalResult.payload?.description,
          columnId: task.columnId,
          userId: task.userId,
          users: task.users
        }

        this.taskService.updateTask(
          (task.boardId ?? ''),
          (task.columnId ?? ''),
          (task._id ?? ''),
          updatedTask
        );
      } else if(modalResult.result === 'delete') {
        this.dialog.open(ConfirmationModalComponent, {
          data: {
            innerDialogText: 'Are you sure want to delete this task?',
          }
        }).afterClosed().subscribe(result => {
          if(result) {
            this.taskService.onDeleteTaskUpdatePage(task.boardId ?? '', task.columnId ?? '', task._id ?? '')
          }
          });
      }
    });
  }
}
