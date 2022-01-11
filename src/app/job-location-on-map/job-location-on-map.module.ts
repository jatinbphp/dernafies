import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JobLocationOnMapPageRoutingModule } from './job-location-on-map-routing.module';

import { JobLocationOnMapPage } from './job-location-on-map.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JobLocationOnMapPageRoutingModule
  ],
  declarations: [JobLocationOnMapPage]
})
export class JobLocationOnMapPageModule {}
