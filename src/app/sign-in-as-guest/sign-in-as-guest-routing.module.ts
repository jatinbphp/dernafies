import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignInAsGuestPage } from './sign-in-as-guest.page';

const routes: Routes = [
  {
    path: '',
    component: SignInAsGuestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignInAsGuestPageRoutingModule {}
