import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  onLogin() {
    this.authService.login();
    this.loadingController
      .create({
        keyboardClose: true,
        message: 'Logging in...'
      })
      .then(loadingEl => {
        loadingEl.present();
        setTimeout(() => {
          loadingEl.dismiss();
          this.router.navigateByUrl('/places/tabs/discover');
        }, 1500);
      });
  }

  onSubmit(authForm: NgForm) {
    console.log(authForm);
  }
}
