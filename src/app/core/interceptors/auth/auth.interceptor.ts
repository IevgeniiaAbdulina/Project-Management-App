import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthUserService } from 'src/app/features/user/services/auth-user/auth-user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthUserService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // console.log('AuthInterceptor Interceptore works!');

    let tokenData = this.auth.tokenValue?.token ?? '';

    const authRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${tokenData}`
      }
    });

    return next.handle(authRequest);
  }
}
