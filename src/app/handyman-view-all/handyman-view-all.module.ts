import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HandymanViewAllPageRoutingModule } from './handyman-view-all-routing.module';
import { HandymanViewAllPage } from './handyman-view-all.page';
import { IonicRatingComponentModule } from 'ionic-rating-component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicRatingComponentModule,
    IonicModule,
    HandymanViewAllPageRoutingModule
  ],
  declarations: [HandymanViewAllPage]
})
export class HandymanViewAllPageModule {}
