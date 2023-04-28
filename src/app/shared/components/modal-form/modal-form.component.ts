import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { ModalFormData } from 'src/app/features/interfaces/modal-form-data';

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.component.html',
  styleUrls: ['./modal-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalFormComponent implements OnInit{
  public createForm!: FormGroup;

  inputValueModal: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ModalFormData,
    public dialogRef: MatDialogRef<ModalFormComponent>,
  ) {}

  ngOnInit(): void {
    this.createForm = new FormGroup({
      valueInput: new FormControl('')
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.createForm.reset();
  }
}
