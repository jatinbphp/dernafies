import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PastRequestsPage } from './past-requests.page';

const routes: Routes = [
  {
    path: '',
    component: PastRequestsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PastRequestsPageRoutingModule {}
