import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {


  isLoading: boolean;
  placeId: string;
  place: Place;
  private placeSub: Subscription;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private placeServices: PlacesService,
    private router: Router,
    private loadingController: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navController.navigateBack('/places/tabs/offers');
        return;
      }
      this.placeId = paramMap.get('placeId');
      this.isLoading = true;
      this.placeSub = this.placeServices.getPlace(this.placeId)
        .subscribe(place => {
          this.editPlace(place);
          },
          error => {
            this.alertCtrl.create({
              header: 'An error occurred!',
              message: 'Place could not be fetched. Please try again later.',
              buttons: [{
                text: 'Okay',
                cssClass: 'danger',
                handler: () => {
                  this.router.navigate(['/places/tabs/offers']);
                }
              }]
            }).then(alertEL => {
              alertEL.present();
            });
          });
    });
  }

  editPlace(place: Place): void {
      this.place = place;
      this.form = new FormGroup({
        title: new FormControl(this.place.title, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        description: new FormControl(this.place.description, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(180)]
        })
      });
      this.isLoading = false;
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

  onUpdateOffer() {
    if (!this.form.valid) { return; }
    this.loadingController.
      create({ message: 'Updating place...' })
      .then(loadingEl => {
        loadingEl.present();
        this.placeServices.updatePlace(
          this.place.id,
          this.form.value.title,
          this.form.value.description
        ).subscribe(() => {
          this.router.navigate(['/places/tabs/offers']);
          loadingEl.dismiss();
        });
      });
  }
}
