import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';
import { getValidatorErrorMessage } from 'src/app/shared/utils/validators-utils';

@Component({
  selector: '[app-error-messages]',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./error-messages.component.scss'],
  template: `<ng-container *ngIf="errorMessage !== null">{{ errorMessage }}</ng-container>`
})
export class ErrorMessagesComponent {
  @Input()
  control!: AbstractControl

  constructor() {}


  get errorMessage() {
    for(let validatorName in this.control?.errors) {
      if(this.control.touched) {
        return getValidatorErrorMessage(validatorName, this.control.errors[validatorName])
      }
    }

    return null;
  }
}
