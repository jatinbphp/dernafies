import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HandymanSelectedPageRoutingModule } from './handyman-selected-routing.module';
import { HandymanSelectedPage } from './handyman-selected.page';
import { IonicRatingComponentModule } from 'ionic-rating-component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicRatingComponentModule,
    IonicModule,
    HandymanSelectedPageRoutingModule
  ],
  declarations: [HandymanSelectedPage]
})
export class HandymanSelectedPageModule {}
