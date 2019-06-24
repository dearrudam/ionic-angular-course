import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _userId: string;
  private _userIsAuthenticated = true;

  get useIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  get userId(): string {
    return this._userId;
  }

  constructor() {
    this._userId = 'dearrudam@gmail.com';
    this._userIsAuthenticated = true;
  }

  async login(email: string, password: string): Promise<any> {
    this._userId = email;
    this._userIsAuthenticated = true;
    return this._userId;
  }

  async logout(): Promise<void> {
    this._userId = null;
    this._userIsAuthenticated = false;
  }
}
