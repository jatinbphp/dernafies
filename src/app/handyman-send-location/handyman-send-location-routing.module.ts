import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HandymanSendLocationPage } from './handyman-send-location.page';

const routes: Routes = [
  {
    path: '',
    component: HandymanSendLocationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HandymanSendLocationPageRoutingModule {}
