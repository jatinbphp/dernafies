import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CurrentRequestsPageRoutingModule } from './current-requests-routing.module';
import { CurrentRequestsPage } from './current-requests.page';
import { MomentModule } from 'angular2-moment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MomentModule,
    CurrentRequestsPageRoutingModule
  ],
  declarations: [CurrentRequestsPage]
})
export class CurrentRequestsPageModule {}
