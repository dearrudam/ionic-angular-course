import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  get places() {
    return [...this._places];
  }


  constructor() { }

  private _places: Place[] = [
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York!',
      'https://static.giggster.com/images/location/2b128edf-22b8-4f26-802b-506760ed5a66/8e0d0ad3-1743-4d13-8394-282386303b59/gallery_1.jpeg',
      149.99),
    new Place(
      'p2',
      'L\'Amour Toujours',
      'A romantic place in Paris!',
      'https://old.tophotel.news/wp-content/uploads/2018/06/image004.jpg',
      189.99),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip!',
      'https://static.wixstatic.com/media/e82b44_570944c45adb49fb9a1f624ac0b0ef79.jpg',
      99.99)
  ];

  getPlace(placeId: string): Place {
    return { ...this._places.find(p => p.id === placeId) };
  }

}
