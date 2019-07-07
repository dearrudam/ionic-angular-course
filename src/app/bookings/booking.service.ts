import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { take, delay, tap, map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../auth/auth.service';
import { Booking } from './booking.model';

const endpoint = 'https://ionic-angular-project-9937b.firebaseio.com';

export interface BookingsData {
    id: string;
    placeId: string;
    userId: string;
    placeTitle: string;
    placeImage: string;
    firstName: string;
    lastName: string;
    guestNumber: number;
    bookedFrom: string;
    bookedTo: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {

    private _bookings = new BehaviorSubject<Booking[]>([]);

    constructor(
        private authService: AuthService,
        private http: HttpClient) { }

    get bookings() {
        return this._bookings;
    }

    fetchBookings() {
        return this.http
            /**
             * It's needed to setup the firebase to index:
             *
             * {
             *  "rules": {
             *       ".read": true,
             *       ".write": true,
             *       "bookings": {
             *       ".indexOn" : ["userId"]
             *       }
             *   }
             * }
             *
             *
             */
            .get<{ [key: string]: BookingsData }>(`${endpoint}/bookings.json?orderBy="userId"&equalTo="${this.authService.userId}"`)
            .pipe(
                map(bookingsData => {
                    const bookings = [];
                    for (const key in bookingsData) {
                        if (bookingsData.hasOwnProperty(key)) {
                            const data = bookingsData[key];
                            bookings.push(new Booking(
                                key,
                                data.placeId,
                                data.userId,
                                data.placeTitle,
                                data.placeImage,
                                data.firstName,
                                data.lastName,
                                data.guestNumber,
                                new Date(data.bookedFrom),
                                new Date(data.bookedTo)));
                        }
                    }
                    return bookings;
                }),
                tap(bookings => {
                    this._bookings.next(bookings);
                })
            );
    }

    addBooking(
        placeId: string,
        placeTitle: string,
        placeImage: string,
        firstName: string,
        lastName: string,
        guestNumber: number,
        bookedFrom: Date,
        bookedTo: Date) {

        const newBooking = new Booking(
            '',
            placeId,
            this.authService.userId(),
            placeTitle,
            placeImage,
            firstName,
            lastName,
            guestNumber,
            bookedFrom,
            bookedTo
        );


        return this.http
            .post<{ name: string }>(
                `${endpoint}/bookings.json`,
                { ...newBooking, id: null }
            )
            .pipe(
                switchMap(bookingsData => {
                    newBooking.id = bookingsData.name;
                    return this.bookings;
                }),
                take(1),
                tap(bookings => {
                    this._bookings.next(bookings.concat(newBooking));
                })
            );
    }

    cancelBooking(bookingId: string) {
        return this.http
            .delete(`${endpoint}/bookings/${bookingId}.json`)
            .pipe(
                switchMap(() => {
                    return this.bookings;
                }),
                take(1),
                tap(bookings => {
                    this._bookings.next(bookings.filter(b => b.id !== bookingId));
                })
            );
    }
}
