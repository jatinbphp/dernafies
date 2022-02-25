import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { JobDescriptionPageRoutingModule } from './job-description-routing.module';
import { JobDescriptionPage } from './job-description.page';
import { IonicRatingComponentModule } from 'ionic-rating-component';
import { MomentModule } from 'angular2-moment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicRatingComponentModule,
    MomentModule,
    JobDescriptionPageRoutingModule
  ],
  declarations: [JobDescriptionPage]
})
export class JobDescriptionPageModule {}
