import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RescheduleJobPage } from './reschedule-job.page';

const routes: Routes = [
  {
    path: '',
    component: RescheduleJobPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RescheduleJobPageRoutingModule {}
