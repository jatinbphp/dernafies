import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CurrentRequestsPageRoutingModule } from './current-requests-routing.module';

import { CurrentRequestsPage } from './current-requests.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CurrentRequestsPageRoutingModule
  ],
  declarations: [CurrentRequestsPage]
})
export class CurrentRequestsPageModule {}
