import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PastRequestsPageRoutingModule } from './past-requests-routing.module';

import { PastRequestsPage } from './past-requests.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PastRequestsPageRoutingModule
  ],
  declarations: [PastRequestsPage]
})
export class PastRequestsPageModule {}
