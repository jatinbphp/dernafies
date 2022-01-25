import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PastRequestsPageRoutingModule } from './past-requests-routing.module';
import { PastRequestsPage } from './past-requests.page';
import { MomentModule } from 'angular2-moment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MomentModule,
    IonicModule,
    PastRequestsPageRoutingModule
  ],
  declarations: [PastRequestsPage]
})
export class PastRequestsPageModule {}
