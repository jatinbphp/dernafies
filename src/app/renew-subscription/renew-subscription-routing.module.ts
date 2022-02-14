import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RenewSubscriptionPage } from './renew-subscription.page';

const routes: Routes = [
  {
    path: '',
    component: RenewSubscriptionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RenewSubscriptionPageRoutingModule {}
