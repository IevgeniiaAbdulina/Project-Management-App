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
    public dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData,
  ) {
    this.innerModalText = 'Confirm your action';
  }

  close() {
    console.log('Close Confirmation modal');
    this.dialogRef.close(!this.dialogResult);
  }

  confirmHandler(): void {
    console.log('Confirmation submit');
    this.dialogRef.close(this.dialogResult);
  }
}
