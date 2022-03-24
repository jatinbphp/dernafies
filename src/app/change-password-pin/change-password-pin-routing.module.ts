import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangePasswordPinPage } from './change-password-pin.page';

const routes: Routes = [
  {
    path: '',
    component: ChangePasswordPinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangePasswordPinPageRoutingModule {}
