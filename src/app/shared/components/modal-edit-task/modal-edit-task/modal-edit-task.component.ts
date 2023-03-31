import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalFormData } from 'src/app/features/interfaces/modal-form-data';
import { ModalFormResult } from 'src/app/features/interfaces/modal-form-result';
import { ModalFormComponent } from '../../modal-form/modal-form.component';

@Component({
  selector: 'app-modal-edit-task',
  templateUrl: './modal-edit-task.component.html',
  styleUrls: ['./modal-edit-task.component.scss']
})
export class ModalEditTaskComponent {
  public editTaskForm!: FormGroup;

  title: string | null = null;
  description: string | null = null;


  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalFormData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close(new ModalFormResult('cancel'));
  }

  ngOnInit(): void {
    this.editTaskForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
      ]),
      description: new FormControl(''),
    })

    this.title = this.data.title;
    this.description = this.data.description;

  }

  onSubmit(): void {
    this.dialogRef.close(new ModalFormResult('edit', {
      title: this.title,
      description: this.description
    }
    ));
    this.editTaskForm.reset();
  }

  onDeleteClick() {
    this.dialogRef.close(new ModalFormResult('delete'));
  }
}
