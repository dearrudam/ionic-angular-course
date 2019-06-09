import { Component, OnInit } from '@angular/core';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

  loadedPlaces: Place[];

  constructor(
    private menuController: MenuController,
    private placesServices: PlacesService) { }

  ngOnInit() {
    this.loadedPlaces = this.placesServices.places;
    console.log(this.loadedPlaces);
  }

  onOpenMenu() {
    this.menuController.toggle();
  }

}
