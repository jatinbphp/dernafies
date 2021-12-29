import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HandymanSelectedPageRoutingModule } from './handyman-selected-routing.module';

import { HandymanSelectedPage } from './handyman-selected.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HandymanSelectedPageRoutingModule
  ],
  declarations: [HandymanSelectedPage]
})
export class HandymanSelectedPageModule {}
