import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthUserService } from 'src/app/features/user/services/auth-user/auth-user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private router: Router,
    private authUserService: AuthUserService
  ) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log('Check AUTH GUARD ');

      const url: string = state.url;
      return this.checkLogin(url);
  }

  checkLogin(url: string): boolean | Observable<boolean> | Promise<boolean> {
    console.log('Ckeck LOGIN');
    const token = localStorage.getItem('token');

    if(token) {
      return true;
    }


    this.router.navigateByUrl('home')
    return false;
  }

  public canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let url = `/${route.path}`;
    return this.checkLogin(url);
  }
}
