import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignUpWithPinPage } from './sign-up-with-pin.page';

const routes: Routes = [
  {
    path: '',
    component: SignUpWithPinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignUpWithPinPageRoutingModule {}
