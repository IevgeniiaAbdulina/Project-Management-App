import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { ConfirmationDialogData } from 'src/app/features/interfaces/confirmation-dialog-data';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {
  innerModalText = '';
  dialogResult = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData,
    public dialogRef: MatDialogRef<ConfirmationModalComponent>,
  ) {
    this.innerModalText = 'Confirm your action';
  }

  close() {
    this.dialogRef.close(!this.dialogResult);
  }

  confirmHandler(): void {
    this.dialogRef.close(this.dialogResult);
  }
}
