import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReviewAndRatingPageRoutingModule } from './review-and-rating-routing.module';
import { ReviewAndRatingPage } from './review-and-rating.page';
import { IonicRatingComponentModule } from 'ionic-rating-component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    IonicRatingComponentModule,
    ReviewAndRatingPageRoutingModule
  ],
  declarations: [ReviewAndRatingPage]
})
export class ReviewAndRatingPageModule {}
