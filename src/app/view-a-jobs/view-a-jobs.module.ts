import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ViewAJobsPageRoutingModule } from './view-a-jobs-routing.module';
import { ViewAJobsPage } from './view-a-jobs.page';
import { IonicRatingComponentModule } from 'ionic-rating-component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicRatingComponentModule,
    ViewAJobsPageRoutingModule
  ],
  declarations: [ViewAJobsPage]
})
export class ViewAJobsPageModule {}
