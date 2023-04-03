import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Alert, AlertOptions, AlertType } from '../../models/alert';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private subject = new Subject<Alert>();
  private defaultId = 'Connection Error';

  durationInSeconds = 5;

  constructor(
    private _snackBar: MatSnackBar,
  ) {}

  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: this.durationInSeconds * 1000,
    });
  }

  public alertMessage(message: string) {
    return this.openSnackBar(message, 'close')
  }

  // eneble subscribing to alerts observable
  onAlert(id = this.defaultId): Observable<Alert> {
    return this.subject.asObservable().pipe(filter(x => x && x.id === id));
  }

  // [ERROR] Alert Error Message
  error(message: string, options?: AlertOptions) {
    this.alert(new Alert({ ...options, type: AlertType.Error, message }))
  }

  // [SUCCESS] Alert success Message
  success(message: string, options?: AlertOptions) {
    return this.alert(new Alert({ ...options, type: AlertType.Success, message }))
  }

  // main alert method
  alert(alert: Alert) {
    alert.id = alert.id || this.defaultId;
    this.subject.next(alert);
    this.openSnackBar(`${alert.id}`, 'close')
  }

  // clear alerts
  clear(id = this.defaultId) {
    this.subject.next(new Alert({ id }));
  }
}
