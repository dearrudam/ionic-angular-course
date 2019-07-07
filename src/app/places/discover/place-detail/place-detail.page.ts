import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ModalController, ActionSheetController, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { Place } from '../../place.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PlacesService } from '../../places.service';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { Subscription } from 'rxjs';
import { BookingService } from 'src/app/bookings/booking.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {

  isLoading = false;
  place: Place;
  isBookable = false;
  private placeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navController: NavController,
    private placesService: PlacesService,
    private bookingService: BookingService,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private loadingController: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navController.navigateBack('/places/tabs/discover');
        return;
      }
      const placeId = paramMap.get('placeId');
      this.isLoading = true;
      this.placeSub = this.placesService.getPlace(placeId)
        .subscribe(
          place => {
            this.place = place;
            this.isBookable = this.place.userId !== this.authService.userId();
            this.isLoading = false;
          },
          error => {
            this.alertCtrl.create({
              header: 'An error occurred!'
              , message: 'Place cannot be fetched. Please try again later.',
              buttons: [
                {
                  text: 'Okay',
                  cssClass: 'danger'
                  , handler: () => {
                    this.router.navigate(['/places/tabs/discover']);
                  }
                }
              ]
            }).then(alertEl => {
              alertEl.present();
            });
          });
    });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

  onBookPlace() {
    this.actionSheetController
      .create({
        header: 'Choose an action',
        buttons: [
          {
            text: 'Select date',
            handler: () => {
              this.openBookingModel('select');
            }
          },
          {
            text: 'Random date',
            handler: () => {
              this.openBookingModel('random');
            }
          },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      })
      .then(actionSheetEl => {
        actionSheetEl.present();
      });
  }

  openBookingModel(mode: 'select' | 'random') {
    this.modalController.create({
      component: CreateBookingComponent,
      componentProps: {
        selectedPlace: this.place, selectedMode: mode
      }
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    }).then(resultData => {
      if (resultData.role === 'confirm') {
        const bookingData = resultData.data.bookingData;
        this.loadingController
          .create({
            message: 'Booking ...'
          })
          .then(loadingEl => {
            loadingEl.present();
            this.bookingService.addBooking(
              this.place.id,
              this.place.title,
              this.place.imageUrl,
              bookingData.firstName,
              bookingData.lastName,
              bookingData.guestNumber,
              bookingData.startDate,
              bookingData.endDate
            ).subscribe(() => {
              this.toastCtrl
                .create({
                  animated: true,
                  duration: 1500,
                  message: `Booking created!`,
                  showCloseButton: true,
                  closeButtonText: 'Close'
                })
                .then(toastEL => {
                  toastEL.present();
                  loadingEl.dismiss();
                });
            });
          });
      }
    });
  }
}
