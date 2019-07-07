import { TestBed, inject } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { Router, UrlSegment } from '@angular/router';
import { AuthService } from './auth.service';
import { Route } from '@angular/compiler/src/core';

describe('AuthGuard', () => {

  let authServiceSpy: AuthService;
  let routeSpy: Route;
  let routerSpy: Router;

  beforeEach(() => {
    routeSpy = jasmine.createSpyObj('Route', ['children', 'loadChildren']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['userIsAuthenticated']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      providers: [AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }],
    });
  });

  it('should redirect to authentication page if the current user is not authenticated', inject([AuthGuard], (guard: AuthGuard) => {
    (authServiceSpy.userIsAuthenticated as any).and.callFake(() => false);
    expect(guard).toBeTruthy();
    const result = guard.canLoad(routeSpy, new Array<UrlSegment>());
    expect(result).toBeFalsy();
    expect(routerSpy.navigateByUrl).toHaveBeenCalled();
  }));

  it('should not redirect to authentication page if the current user is authenticated', inject([AuthGuard], (guard: AuthGuard) => {
    (authServiceSpy.userIsAuthenticated as any).and.callFake(() => true);
    expect(guard).toBeTruthy();
    const result = guard.canLoad(routeSpy, new Array<UrlSegment>());
    expect(result).toBeTruthy();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledTimes(0);
  }));
});
