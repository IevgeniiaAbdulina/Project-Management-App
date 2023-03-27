import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialDesignModule } from 'src/app/shared/material-design/material-design.module';
import { EditUserProfileComponent } from './pages/edit-user-profile/edit-user-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRoutingModule } from './user-routing.module';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { BoardPageComponent } from './pages/board-page/board-page.component';
import { BoardCardComponent } from './components/board-card/board-card.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TaskItemComponent } from './components/task-item/task-item.component';
import {TaskListComponent } from './components/task-list/task-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TaskService } from './services/task/task.service';
import { AuthUserService } from './services/auth-user/auth-user.service';

@NgModule({
  declarations: [
    DashboardPageComponent,
    BoardPageComponent,
    BoardCardComponent,
    TaskItemComponent,
    TaskListComponent,
    EditUserProfileComponent,
  ],
  imports: [
    UserRoutingModule,
    CommonModule,
    MaterialDesignModule,
    ReactiveFormsModule,
    DragDropModule,
    FormsModule,
    SharedModule
  ],
  exports: [],
  providers: [
    TaskService,
    AuthUserService
  ]
})
export class UserModule { }
