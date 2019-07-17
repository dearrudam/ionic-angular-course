import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService, AuthResponseData } from './auth.service';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  isLogin = true;

  @ViewChild('authForm') form: NgForm;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    const email = this.form.value.email;
    const password = this.form.value.password;
    this.authenticate(email, password);
  }

  private authenticate(email: string, password: string) {
    this.loadingController
      .create({
        keyboardClose: true,
        message: 'Logging in...'
      })
      .then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<AuthResponseData>;
        if (this.isLogin) {
          authObs = this.authService.login(email, password);
        } else {
          authObs = this.authService.signup(email, password);
        }
        authObs
          .subscribe(
            authResp => {
              console.log(authResp);
              loadingEl.dismiss();
              this.router.navigateByUrl('/places/tabs/discover');
              this.form.reset();
            },
            errorResp => {
              loadingEl.dismiss();
              console.log(errorResp);
              const code = errorResp.error.error.message;
              let message = 'Could not sign you up, please try again.';
              if (code === 'EMAIL_EXISTS') {
                message = 'This email address exists already!';
              } else if (code === 'EMAIL_NOT_FOUND') {
                message = 'E-Mail address could not be found.';
              } else if (code === 'INVALID_PASSWORD') {
                message = 'This password is not correct.';
              }
              this.showAlert(message);
            });
      });
  }
  private showAlert(message: string) {
    this.alertController
      .create({
        header: 'Authentication failed',
        message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }
}
