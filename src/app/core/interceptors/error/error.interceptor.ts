import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthUserService } from 'src/app/features/user/services/auth-user/auth-user.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authUserService: AuthUserService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError((err) => {
      if([401, 403].includes(err.status) && this.authUserService.userValue) {
        this.authUserService.logout();
      }

      const error = err.error?.message || err.statusCode;
      console.error(err);
      return throwError(() => error);
    }))
  }
}
