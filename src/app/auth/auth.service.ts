import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _userId = 'dearrudam@gmail.com';
  private _userIsAuthenticated = true;

  userIsAuthenticated(): boolean {
    return this._userIsAuthenticated ;
  }

  userId(): string {
    return this._userId;
  }

  constructor() {
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
