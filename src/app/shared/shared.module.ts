import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialDesignModule } from './material-design/material-design.module';
import { ModalFormComponent } from './components/modal-form/modal-form.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HighlightCustomColorDirective } from './directives/highlight-custom-color.directive';
import { ModalEditTaskComponent } from './components/modal-edit-task/modal-edit-task/modal-edit-task.component';

@NgModule({
  declarations: [
    ModalFormComponent,
    ConfirmationModalComponent,
    HighlightCustomColorDirective,
    ModalEditTaskComponent,
  ],
  imports: [
    CommonModule,
    MaterialDesignModule,
    ReactiveFormsModule,
  ],
  exports: [
    HighlightCustomColorDirective,
  ],
})
export class SharedModule { }
