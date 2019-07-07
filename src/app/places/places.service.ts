import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor(private authService: AuthService) { }

  private _places = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York!',
      'https://static.giggster.com/images/location/2b128edf-22b8-4f26-802b-506760ed5a66/8e0d0ad3-1743-4d13-8394-282386303b59/gallery_1.jpeg',
      149.99,
      new Date('2019-01-01'),
      new Date('2019-12-31')),
    new Place(
      'p2',
      'L\'Amour Toujours',
      'A romantic place in Paris!',
      'https://old.tophotel.news/wp-content/uploads/2018/06/image004.jpg',
      189.99,
      new Date('2019-01-01'),
      new Date('2019-12-31')),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip!',
      'https://static.wixstatic.com/media/e82b44_570944c45adb49fb9a1f624ac0b0ef79.jpg',
      99.99,
      new Date('2019-01-01'),
      new Date('2019-12-31')),
    new Place(
      'p4',
      'The Foggy Palace 2',
      'Not your average city trip!',
      'https://static.wixstatic.com/media/e82b44_570944c45adb49fb9a1f624ac0b0ef79.jpg',
      88.99,
      new Date('2019-01-01'),
      new Date('2019-12-31')),
    new Place(
      'p5',
      'The Foggy Palace 3',
      'Not your average city trip!',
      'https://static.wixstatic.com/media/e82b44_570944c45adb49fb9a1f624ac0b0ef79.jpg',
      77.99,
      new Date('2019-01-01'),
      new Date('2019-12-31')),
    new Place(
      'p6',
      'The Foggy Palace 4',
      'Not your average city trip!',
      'https://static.wixstatic.com/media/e82b44_570944c45adb49fb9a1f624ac0b0ef79.jpg',
      77.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'))
  ]);

  get places() {
    return this._places;
  }

  getPlace(placeId: string): Observable<Place> {
    return this._places.pipe(take(1), map(places => {
      return places.find(p => p.id === placeId);
    }));
  }

  addPlace(title: string,
           description: string,
           imageUrl: string,
           price: number,
           availableFrom: Date,
           availableTo: Date) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      imageUrl,
      price,
      availableFrom,
      availableTo,
      this.authService.userId()
    );
    return this.places.pipe(
      take(1),
      delay(1000),
      tap(places => {
        this._places.next(places.concat(newPlace));
      }));
  }

  updatePlace(placeId: string, title: string, description: string) {
    return this.places.pipe(
      take(1),
      delay(1000),
      tap(places => {

        const updatePlaces = [...places];
        const updatedPlaceIndex = updatePlaces.findIndex(p => p.id === placeId);

        const oldPlace = updatePlaces[updatedPlaceIndex];
        updatePlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );

        this._places.next(updatePlaces);
      }));
  }
}
