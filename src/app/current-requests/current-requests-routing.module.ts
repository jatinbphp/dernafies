import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CurrentRequestsPage } from './current-requests.page';

const routes: Routes = [
  {
    path: '',
    component: CurrentRequestsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CurrentRequestsPageRoutingModule {}
