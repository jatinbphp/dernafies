import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobLocationOnMapPage } from './job-location-on-map.page';

const routes: Routes = [
  {
    path: '',
    component: JobLocationOnMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobLocationOnMapPageRoutingModule {}
