import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscriber, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';


// [
//   new Place(
//     'p1',
//     'Manhattan Mansion',
//     'In the heart of New York!',
//     'https://static.giggster.com/images/location/2b128edf-22b8-4f26-802b-506760ed5a66/8e0d0ad3-1743-4d13-8394-282386303b59/gallery_1.jpeg',
//     149.99,
//     new Date('2019-01-01'),
//     new Date('2019-12-31')),
//   new Place(
//     'p2',
//     'L\'Amour Toujours',
//     'A romantic place in Paris!',
//     'https://old.tophotel.news/wp-content/uploads/2018/06/image004.jpg',
//     189.99,
//     new Date('2019-01-01'),
//     new Date('2019-12-31')),
//   new Place(
//     'p3',
//     'The Foggy Palace',
//     'Not your average city trip!',
//     'https://static.wixstatic.com/media/e82b44_570944c45adb49fb9a1f624ac0b0ef79.jpg',
//     99.99,
//     new Date('2019-01-01'),
//     new Date('2019-12-31')),
//   new Place(
//     'p4',
//     'The Foggy Palace 2',
//     'Not your average city trip!',
//     'https://static.wixstatic.com/media/e82b44_570944c45adb49fb9a1f624ac0b0ef79.jpg',
//     88.99,
//     new Date('2019-01-01'),
//     new Date('2019-12-31')),
//   new Place(
//     'p5',
//     'The Foggy Palace 3',
//     'Not your average city trip!',
//     'https://static.wixstatic.com/media/e82b44_570944c45adb49fb9a1f624ac0b0ef79.jpg',
//     77.99,
//     new Date('2019-01-01'),
//     new Date('2019-12-31')),
//   new Place(
//     'p6',
//     'The Foggy Palace 4',
//     'Not your average city trip!',
//     'https://static.wixstatic.com/media/e82b44_570944c45adb49fb9a1f624ac0b0ef79.jpg',
//     77.99,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'))
// ]

const endpoint = 'https://ionic-angular-project-9937b.firebaseio.com';

interface PlaceData {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  availableFrom: string;
  availableTo: string;
  userId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor(
    private authService: AuthService,
    private http: HttpClient) { }

  private _places = new BehaviorSubject<Place[]>([]);

  get places() {
    return this._places;
  }

  fetchPlaces() {
    return this.http
      .get<{ [key: string]: PlaceData }>(`${endpoint}/offered-places.json`)
      .pipe(
        map(resData => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              const data = resData[key];
              places.push(new Place(
                key,
                data.title,
                data.description,
                data.imageUrl,
                data.price,
                new Date(data.availableFrom),
                new Date(data.availableTo),
                data.userId
              ));
            }
          }
          return places;
        }),
        tap(places => {
          this.places.next(places);
        }));
  }

  getPlace(placeId: string): Observable<Place> {

    return this.http
      .get<PlaceData>(
        `${endpoint}/offered-places/${placeId}.json`
      ).pipe(
        map(placeData => {
          return new Place(
            placeId,
            placeData.title,
            placeData.description,
            placeData.imageUrl,
            placeData.price,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userId
          );
        })
      );
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
    return this.http
      .post<{ name: string }>(`${endpoint}/offered-places.json`, {
        ...newPlace, id: null
      }).pipe(
        switchMap(resData => {
          newPlace.id = resData.name;
          return this.places;
        }),
        take(1),
        tap(places => {
          this._places.next(places.concat(newPlace));
        }));
  }

  updatePlace(placeId: string, title: string, description: string) {

    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap(places => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap(places => {
        updatedPlaces = [...places];
        const updatedPlaceIndex = updatedPlaces.findIndex(p => p.id === placeId);

        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        return this.http.put(
          `${endpoint}/offered-places/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }),
      tap(places => {
        this._places.next(updatedPlaces);
      }));
  }
}
