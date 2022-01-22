import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompleteTheJobPage } from './complete-the-job.page';

const routes: Routes = [
  {
    path: '',
    component: CompleteTheJobPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompleteTheJobPageRoutingModule {}
