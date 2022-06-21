import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignUpWithPinCompletionPage } from './sign-up-with-pin-completion.page';

const routes: Routes = [
  {
    path: '',
    component: SignUpWithPinCompletionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignUpWithPinCompletionPageRoutingModule {}
