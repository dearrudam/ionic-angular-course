import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../src/environments/environment';
import { map, tap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';

import { User } from './user.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private activeAutologoutTimer: any;

  constructor(private http: HttpClient) {
  }

  private _user = new BehaviorSubject<User>(null);

  userIsAuthenticated() {
    return this._user
      .asObservable()
      .pipe(
        map(user => {
          if (user) {
            return !!user.token;
          }
          return false;
        })
      );
  }

  userId() {
    return this._user
      .asObservable()
      .pipe(
        map(user => {
          if (user) {
            return user.id;
          }
          return null;
        })
      );
  }

  autologin() {
    return from(Plugins.Storage.get({ key: 'authData' })).
      pipe(
        map(storedData => {

          if (!storedData || !storedData.value) {
            return null;
          }

          const parsedData = JSON.parse(storedData.value) as { id: string; email: string; token: string; expirationTime: string };

          const expirationTime = new Date(parsedData.expirationTime);

          if (expirationTime <= new Date()) {
            return null;
          }

          const user = new User(parsedData.id, parsedData.email, parsedData.token, expirationTime);

          return user;

        }),
        tap(user => {
          if (user) {
            this._user.next(user);
            this.autologout(user.tokenDuration);
          }
        }),
        map(user => {
          return !!user;
        }));
  }

  private autologout(duration: number) {
    if (this.activeAutologoutTimer) {
      clearTimeout(this.activeAutologoutTimer);
    }
    this.activeAutologoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  ngOnDestroy() {
    if (this.activeAutologoutTimer) {
      clearTimeout(this.activeAutologoutTimer);
    }
  }

  signup(email: string, password: string): Observable<AuthResponseData> {

    return this.http.post<AuthResponseData>(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${
      environment.firebaseConfig.apiKey
      }`,
      {
        email,
        password,
        returnSecureToken: true
      })
      .pipe(tap(this.setUserData.bind(this)));
  }

  login(email: string, password: string): Observable<AuthResponseData> {

    return this.http.post<AuthResponseData>(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${
      environment.firebaseConfig.apiKey
      }`,
      {
        email,
        password,
        returnSecureToken: true
      })
      .pipe(tap(this.setUserData.bind(this)));

  }

  private setUserData(authResponse: AuthResponseData) {
    const expirationTime = new Date(new Date().getTime() + (+authResponse.expiresIn * 1000));
    const user = new User(authResponse.localId, authResponse.email, authResponse.idToken, expirationTime);
    this._user.next(user);
    this.autologout(user.tokenDuration);
    this.storeAuthData(authResponse.localId, authResponse.email, authResponse.idToken, expirationTime);
  }


  private storeAuthData(id: string, email: string, token: string, expirationTime: Date) {
    const data = JSON.stringify({
      id,
      email,
      token,
      expirationTime: expirationTime.toISOString()
    });
    Plugins.Storage.set({ key: 'authData', value: data });
  }

  logout() {
    this._user.next(null);
    Plugins.Storage.remove({ key: 'authData' });
  }
}
