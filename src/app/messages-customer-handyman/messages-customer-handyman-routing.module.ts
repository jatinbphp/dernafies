import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MessagesCustomerHandymanPage } from './messages-customer-handyman.page';

const routes: Routes = [
  {
    path: '',
    component: MessagesCustomerHandymanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MessagesCustomerHandymanPageRoutingModule {}
