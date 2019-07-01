import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding, LoadingController, ModalController, AlertController, ToastController } from '@ionic/angular';

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
  isLoading = false;
  private bookingsSub: Subscription;

  constructor(
    private bookingService: BookingService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    this.bookingsSub = this.bookingService.bookings.subscribe(bookings => {
      this.isLoading = true;
      this.loadedBookings = bookings;
      this.isLoading = false;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.bookingService.fetchBookings().subscribe();
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
                slidingBookingItem.close();
                this.bookingService.cancelBooking(bookingId).subscribe(() => {
                  loadingEl.dismiss();
                  this.toastController
                    .create({
                      animated: true,
                      duration: 3000,
                      message: `The booking ${bookingId} has been canceled!`,
                      showCloseButton: true,
                      closeButtonText: 'Close'
                    })
                    .then(toastEL => {
                      toastEL.present();
                    });
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
