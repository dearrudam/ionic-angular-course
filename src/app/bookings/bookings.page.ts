import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding, LoadingController, ModalController, AlertController } from '@ionic/angular';

import { BookingService } from './booking.service';
import { Booking } from './booking.model';
import { Subscription } from 'rxjs';
import { ignoreElements } from 'rxjs/operators';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {

  loadedBookings: Booking[];
  private bookingsSub: Subscription;

  constructor(
    private bookingService: BookingService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.bookingsSub = this.bookingService.bookings.subscribe(bookings => {
      this.loadedBookings = bookings;
    });
  }

  ngOnDestroy() {
    if (this.bookingsSub) {
      this.bookingsSub.unsubscribe();
    }
  }

  onCancelBooking(bookingId: string, slidingBookingItem: IonItemSliding) {

    this.alertController.create({
      header: 'Cancelling a booking...',
      message: 'Are you sure that you want to cancel this booking?',
      buttons: [
        {
          text: 'No',
          cssClass: 'danger',
          handler: () => {
            slidingBookingItem.close();
          }
        },
        {
          text: 'Yes',
          cssClass: 'primary',
          handler: () => {
            this.loadingController.create({
              message: 'Cancelling ...'
            })
              .then(loadingEl => {
                loadingEl.present();
                this.bookingService.cancelBooking(bookingId).subscribe(() => {
                  slidingBookingItem.close();
                  loadingEl.dismiss();
                  console.log('Should cancel the booking', bookingId);
                });
              });
          }
        }
      ]
    }).then((alertEl) => {
      alertEl.present();
    });




  }
}
