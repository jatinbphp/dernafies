import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HandymanSendLocationPageRoutingModule } from './handyman-send-location-routing.module';

import { HandymanSendLocationPage } from './handyman-send-location.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HandymanSendLocationPageRoutingModule
  ],
  declarations: [HandymanSendLocationPage]
})
export class HandymanSendLocationPageModule {}
