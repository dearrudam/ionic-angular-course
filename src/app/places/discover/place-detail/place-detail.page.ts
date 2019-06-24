import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ModalController, ActionSheetController, LoadingController } from '@ionic/angular';
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
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navController.navigateBack('/places/tabs/discover');
        return;
      }
      this.placeSub = this.placesService.getPlace(paramMap.get('placeId'))
        .subscribe(place => {
          this.place = place;
          this.isBookable = this.place.userId !== this.authService.userId;
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
    console.log(mode);
    this.modalController.create({
      component: CreateBookingComponent,
      componentProps: {
        selectedPlace: this.place, selectedMode: mode
      }
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    }).then(resultData => {
      console.log(resultData.data, resultData.role);
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
              loadingEl.dismiss();
              this.router.navigate(['/bookings']);
            });
          });
      }
    });
  }
}
