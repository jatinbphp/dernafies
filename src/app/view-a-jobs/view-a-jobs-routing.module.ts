import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewAJobsPage } from './view-a-jobs.page';

const routes: Routes = [
  {
    path: '',
    component: ViewAJobsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewAJobsPageRoutingModule {}
