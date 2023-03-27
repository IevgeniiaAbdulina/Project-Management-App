import { Component, OnInit, Inject, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { ModalFormData } from 'src/app/features/interfaces/modal-form-data';

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.component.html',
  styleUrls: ['./modal-form.component.scss']
})
export class ModalFormComponent implements OnInit{
  public createForm!: FormGroup;

  inputValueModal: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<ModalFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalFormData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.createForm = new FormGroup({
      valueInput: new FormControl('')
    })
  }

  onSubmit(): void {
    this.createForm.reset();
  }
}
