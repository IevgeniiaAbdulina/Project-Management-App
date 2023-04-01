import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';

import { TokenData, User } from '../../models/user';

@Injectable({ providedIn: 'root' })
export class AuthUserService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  private tokenSubject: BehaviorSubject<TokenData | null>;
  public token?: Observable<TokenData | null>;

  public users?: any[];

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();

    this.tokenSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('token')!));
    this.token = this.tokenSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }

  public get tokenValue() {
    return this.tokenSubject.value;
  }

   /**
   *
   * LOAD USER
   *
   */
  loadUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  loadToken(token: TokenData) {
    localStorage.setItem('token', JSON.stringify(token));
        this.tokenSubject.next(token);
  }

  /**
   *
   * UPDATE User data
   *
   */
  updateUserData(id: string, updatedUser: any) {

    this.updateUserById(id, updatedUser).subscribe((user) => {
      console.log('[UPDATE USER DATA]', user);

      localStorage.setItem('user', JSON.stringify(user));
      this.userSubject.next(user);
    })
  }
  // -------------------------------

  /**
   * CLEAR all local data
   */
  clearLocalData() {
    localStorage.clear();

    this.userSubject.next(null);
    this.tokenSubject.next(null);
  }
  // -------------------------------


  // Auth
  // API for signIn/signUp
  // -------------------------------

  // [POST]
  // /auth/signin
  // SignIn

  login(login: string, password: string) {
    return this.http.post<TokenData>('auth/signin', { login, password })
      .pipe(map(token => {

        localStorage.setItem('token', JSON.stringify(token));
        this.tokenSubject.next(token);

        this.getUserByLogin(login);
      }))
  }

  // [GET]
  // /auth/check
  // Check user authorization
  checkUserAuth(login: string) {
    return this.http.post<TokenData>('auth/check', login);
  }


  getUserByLogin(login: string) {
    this.getAllUsers().subscribe(users => {
      const currentUser = users.find(u => u.login === login)
      if(currentUser != undefined) {
        localStorage.setItem('user', JSON.stringify(currentUser));
        this.userSubject.next(currentUser);
      }
    });
  }

  // [POST]
  // /auth/signup
  // SignUp

  register(user: User) {
    return this.http.post('auth/signup', user);
  }


  logout() {
    // remove user from local storage and set current user to null
    localStorage.clear();

    this.userSubject.next(null);
    this.tokenSubject.next(null);

    this.router.navigate(['home']);
  }

  // Users API for users
  // ----------------------------
  // [GET]
  // /users
  // Get all Users

  getAllUsers() {
    return this.http.get<User[]>('users');
  }

  // [GET]
  // /users/{userId}
  // Get User by Id

  getUserById(id: string) {
    return this.http.get<User>(`users/${id}`);
  }

  // [PUT]
  // /users/{userId}
  // Update User by Id

  updateUserById(id: string, updatedUser: any) {
    return this.http.put<User>(`users/${id}`, updatedUser);
  }

  // [DELETE]
  // /users/{userId}
  // Delete User by Id

  deleteUser(id: string) {
    return this.http.delete(`users/${id}`)
      .pipe(map(x => {
        // todo:  // auto logout if the logged in user deleted their own record
        this.logout();
        return x;
      }))
  }
}
