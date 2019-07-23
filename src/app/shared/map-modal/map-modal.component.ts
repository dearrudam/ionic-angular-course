import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, OnDestroy, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('map') mapElementRef: ElementRef;

  @Input() center = { lat: -23.608186, lng: -46.5238723 };
  @Input() title = 'Pick Location';
  @Input() selectable = true;
  @Input() closeButtonText = 'Cancel';

  mapClickListener: any;
  googleMaps: any;

  constructor(
    private modalController: ModalController,
    private renderer: Renderer2
  ) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.getGoogleMaps()
      .then(googleMaps => {
        this.googleMaps = googleMaps;
        const mapElement = this.mapElementRef.nativeElement;
        const map = new googleMaps.Map(mapElement, {
          center: this.center,
          zoom: 17
        });

        this.googleMaps.event.addListenerOnce(map, 'idle', () => {
          this.renderer.addClass(mapElement, 'visible');
        });

        if (this.selectable) {
          this.mapClickListener = map.addListener('click', event => {
            const selectedCoords = { lat: event.latLng.lat(), lng: event.latLng.lng() };
            this.modalController.dismiss(selectedCoords);
          });
        } else {
          const marker = new googleMaps.Marker({
            position: this.center,
            map,
            closeButtonText: 'Close',
            title: 'Picked Location'
          });

          marker.setMap(map);
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  ngOnDestroy() {
    if (this.mapClickListener) {
      this.googleMaps.event.removeListener(this.mapClickListener);
    }
  }

  onCancel() {
    this.modalController.dismiss();
  }

  private getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;

    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsAPIKey}`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google Maps SDK is not available!');
        }
      };
    });
  }
}
