import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskItem } from '../../models/task';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';

@Injectable()

export class TaskService {
  //map contains <columnId, List<TaskItem>>
  private taskListSubject: BehaviorSubject<Map<string, TaskItem[]>>;
  public taskList: Observable<Map<string, TaskItem[]>>;
  public tasksMap = new Map<string, TaskItem[]>

  private dataHasBeenFetchedSubject: BehaviorSubject<number>;
  public dataHasBeenFetched: Observable<number>;

  public taskSubject: BehaviorSubject<TaskItem | null>;
  public task: Observable<TaskItem | null>;


  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
  ) {
    this.taskListSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('tasks')!));
    this.taskList = this.taskListSubject.asObservable();

    this.taskSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('task')!));
    this.task = this.taskSubject.asObservable();

    this.dataHasBeenFetchedSubject = new BehaviorSubject(0);
    this.dataHasBeenFetched = this.dataHasBeenFetchedSubject.asObservable();
  }

  public get taskListValue() {
    return this.taskListSubject.value;
  }

  public get taskValue() {
    return this.taskListSubject.value;
  }

  /***
   *
   * Updates orders according to item position,
   * starting from 0
   */

  // updates orders according to item position, starting from 0
  updateOrders(items: TaskItem[]): TaskItem[] {
    let index = 0;

    return items.map((item) => {
      item.order = index;
      index++;
      return item;
    });
  }
  // ----------------------------

  onDeleteTaskUpdatePage(boardId: string, columnId: string, taskId: string) {
    this.deleteTaskById(boardId, columnId, taskId).subscribe(() => {
      this.getTasksInColumn(boardId, columnId)
    })
  }

  updateTask(boardId: string, columnId: string, taskId: string, taskToUpdate: TaskItem) {
    this.updateTaskById(boardId, columnId, taskId, taskToUpdate).subscribe((task) => {
      console.log('[RES] UPDATED TASKS >>>>> : ', task);

      let tasksInColumn = this.tasksMap.get(columnId) ?? [];
      let oldTask = tasksInColumn.find((t) => t._id === taskId);
      if(oldTask != undefined) {
        const indexOfOldTask = tasksInColumn.indexOf(oldTask);
        //replace old item by new one
        tasksInColumn.splice(indexOfOldTask, 1, task)

        this.tasksMap.set(columnId, tasksInColumn);
      }

      this.dataHasBeenFetchedSubject.next(Date.now());
    });
  }

  // Tasks
  // API for tasks
  // ----------------------------------------------------


  // GET
  // /boards/{boardId}/columns/{columnId}/tasks
  // Get Tasks in Column
  getTasksInColumn(boardId: string, columnId: string) {
    this.http.get<TaskItem[]>(`boards/${boardId}/columns/${columnId}/tasks`)
      .subscribe((tasks) => {
        tasks.sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0));
        this.tasksMap.set(columnId, tasks);
        console.log('TASK MAP ==>', this.tasksMap.get(columnId));

        this.taskListSubject.next(this.tasksMap)
        this.dataHasBeenFetchedSubject.next(Date.now())
    });
  };

  // POST
  // /boards/{boardId}/columns/{columnId}/tasks
  // Create Task
  createTask(boardId: string, columnId: string, task: TaskItem) {
    return this.http.post<TaskItem>(`boards/${boardId}/columns/${columnId}/tasks`, task);
  }

  // GET
  // /boards/{boardId}/columns/{columnId}/tasks/{taskId}
  // Get Task by Id
  getTaskById(boardId: string, columnId: string, taskId: string) {
    return this.http.get<TaskItem>(`boards/${boardId}/columns/${columnId}/tasks/${taskId}`);
  };

  // PUT
  // /boards/{boardId}/columns/{columnId}/tasks/{taskId}
  // Update Task by Id
  updateTaskById(boardId: string, columnId: string, taskId: string, updatedtask: any) {
    return this.http.put<TaskItem>(`boards/${boardId}/columns/${columnId}/tasks/${taskId}`, updatedtask);
  };

  // DELETE
  // /boards/{boardId}/columns/{columnId}/tasks/{taskId}
  // Delete Task by Id
  deleteTaskById(boardId: string, columnId: string, taskId: string) {
    return this.http.delete<TaskItem>(`boards/${boardId}/columns/${columnId}/tasks/${taskId}`);
  };

  // GET
  // /tasksSet
  // Get Tasks by ids list, UserId or search request
  getTasksByIdsListOrSearchRequest(taskIdList: string[], userId: string, searchReq: string) {
    return this.http.get<TaskItem[]>('tasksSet')
      .subscribe({
        // filter tasks by params...
      })
  };

  // PATCH
  // /tasksSet
  // Update set of Tasks
  updateSetOfTasks() {
    let requestBody: any[] = [];

    for(let [columnId, taskItems] of this.tasksMap.entries()) {
      taskItems
        .map(task => {
          return {
            _id: task._id,
            order: task.order,
            columnId: columnId,
          }
        })
        .forEach(smallItem => {
          requestBody.push(smallItem)
        });
    }

    this.http.patch<any[]>('tasksSet', requestBody)
      .subscribe( tasks => {
        console.log('RESPONSE PATCH >>> ', tasks)
      })
  };

  // GET
  // /tasksSet/{boardId}
  // Get Tasks by Board Id
  getTasksByBoardId(boardId: string) {
    return this.http.get<TaskItem[]>(`tasksSet/${boardId}`);
  };
}
