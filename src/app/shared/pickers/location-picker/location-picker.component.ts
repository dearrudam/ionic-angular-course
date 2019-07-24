import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ModalController, ActionSheetController, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Plugins, Capacitor } from '@capacitor/core';

import { MapModalComponent } from '../../map-modal/map-modal.component';
import { environment } from './../../../../environments/environment';
import { map, switchMap } from 'rxjs/operators';
import { PlaceLocation, Coordinates } from './../../../places/location.model';
import { of } from 'rxjs';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {

  @Output() locationPick = new EventEmitter<PlaceLocation>();
  @Input() showPreview = false;
  selectedLocationImage: string;
  isLoading: boolean;
  constructor(
    private modalController: ModalController,
    private http: HttpClient,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController
  ) { }

  ngOnInit() { }

  onPickLocation() {
    this.actionSheetController.create({
      header: 'Please choose',
      buttons: [
        {
          text: 'Auto-Locate', handler: () => {
            this.autoLocateUser();
          }
        },
        {
          text: 'Pick on Map', handler: () => {
            this.openGoogleMap();
          }
        },
        {
          text: 'Cancel', role: 'cancel'
        }
      ]
    }).then(actionSheetEL => {
      actionSheetEL.present();
    });
  }

  private autoLocateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showErrorAlert();
      return;
    }
    Plugins.Geolocation
      .getCurrentPosition()
      .then((geoPosition) => {
        const coordinates: Coordinates = {
          lat: geoPosition.coords.latitude,
          lng: geoPosition.coords.longitude
        };
        this.createPlaceLocation(coordinates.lat, coordinates.lng);
      })
      .catch((err) => {
        console.error(err);
        this.showErrorAlert(err.message);
      });
  }

  private showErrorAlert(moreDetails = '') {
    this.alertController.create({
      header: 'Could not fetch location',
      message: `${moreDetails ? moreDetails + '<br/><br/>' : ''}Please use the map to pick  a location!`,
      buttons: [
        {
          text: 'Okay',
          cssClass: 'danger',
          role: 'cancel'
        }
      ]
    }).then(alertEL => alertEL.present());
  }

  private openGoogleMap() {
    this.modalController
      .create({
        component: MapModalComponent
      })
      .then(modalEl => {
        modalEl.onDidDismiss()
          .then(modalData => {
            if (!modalData.data) {
              return;
            }
            this.createPlaceLocation(modalData.data.lat, modalData.data.lng);
          })
          .catch(err => {
            console.error(err);
            this.isLoading = false;
          });
        modalEl.present();
      });
  }

  private createPlaceLocation(lat: number, lng: number) {

    const pickedLocation: PlaceLocation = {
      lat,
      lng,
      address: null,
      staticMapImageUrl: null
    };

    this.isLoading = true;

    this.getAddress(lat, lng).pipe(
      switchMap(address => {
        pickedLocation.address = address;
        return of(this.getMapImage(pickedLocation.lat, pickedLocation.lng, 15));
      })
    ).subscribe(staticMapImageUrl => {
      pickedLocation.staticMapImageUrl = staticMapImageUrl;
      this.selectedLocationImage = staticMapImageUrl;
      this.isLoading = false;
      this.locationPick.emit(pickedLocation);
      this.showPreview = true;
    });
  }

  private getAddress(lat: number, lng: number) {
    return this.http
      .get<any>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapsAPIKey}`
      ).pipe(map(geoData => {
        if (!geoData || !geoData.results || geoData.results.length === 0) {
          return null;
        }
        return geoData.results[0].formatted_address;
      }));
  }

  private getMapImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap&markers=color:red%7Clabel:Place%7C${lat},${lng}&key=${environment.googleMapsAPIKey}`;
  }
}
