import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { MapModalComponent } from './map-modal/map-modal.component';
import { IonicModule } from '@ionic/angular';
import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';

@NgModule({
    declarations: [LocationPickerComponent, MapModalComponent, ImagePickerComponent],
    imports: [CommonModule, IonicModule],
    exports: [LocationPickerComponent, ImagePickerComponent, MapModalComponent],
    entryComponents: [MapModalComponent]
})
export class SharedModule {}
