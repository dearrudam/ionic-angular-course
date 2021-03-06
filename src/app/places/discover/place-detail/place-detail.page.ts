import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ModalController, ActionSheetController, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { Place } from '../../place.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PlacesService } from '../../places.service';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { Subscription } from 'rxjs';
import { BookingService } from 'src/app/bookings/booking.service';
import { AuthService } from 'src/app/auth/auth.service';
import { switchMap, take } from 'rxjs/operators';
import { MapModalComponent } from '../../../shared/map-modal/map-modal.component';

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
      let fetchedUserId: string;
      this.authService.userId()
        .pipe(
          take(1),
          switchMap(userId => {
            if (!userId) {
              throw new Error('User not found');
            }
            fetchedUserId = userId;
            return this.placesService.getPlace(placeId);
          })
        ).subscribe(
          place => {
            this.place = place;
            this.isBookable = this.place.userId !== fetchedUserId;
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

  onShowFullMap() {
    this.modalController.create({
      component: MapModalComponent,
      componentProps: {
        center: this.place.location,
        selectable: false,
        closeButtonText: 'Close',
        title: this.place.location.address
      }
    }).then(modalEl => {
      modalEl.present();
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
