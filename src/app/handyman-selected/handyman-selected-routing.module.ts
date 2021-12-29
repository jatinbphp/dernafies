import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HandymanSelectedPage } from './handyman-selected.page';

const routes: Routes = [
  {
    path: '',
    component: HandymanSelectedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HandymanSelectedPageRoutingModule {}
