import { Component, OnInit } from '@angular/core';
import { IonInfiniteScroll, MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';


@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

  loadedPlaces: Place[];

  listedLoadedPlaces: Place[] = [];

  cursor = 0;
  itemsPerPage = 3;

  constructor(
    private menuController: MenuController,
    private placesServices: PlacesService) { }

  ngOnInit() {
    this.loadedPlaces = this.placesServices.places;
    this.listedLoadedPlaces.push(...this.loadedPlaces.slice(1, this.itemsPerPage));
    this.cursor = this.listedLoadedPlaces.length;
    console.log(this.loadedPlaces);
  }

  onOpenMenu() {
    this.menuController.toggle();
  }

  onScrolling(event: IonInfiniteScroll) {

    setTimeout(() => {
      this.listedLoadedPlaces.push(...this.loadedPlaces.slice(this.cursor, this.cursor + this.itemsPerPage));
      this.cursor = this.listedLoadedPlaces.length;
      event.complete();

      if (this.cursor >= this.loadedPlaces.length) {
        event.disabled = true;
      }
    }, 500);

  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    console.log(event.detail);
  }
}
