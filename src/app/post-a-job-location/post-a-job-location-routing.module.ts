import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostAJobLocationPage } from './post-a-job-location.page';

const routes: Routes = [
  {
    path: '',
    component: PostAJobLocationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostAJobLocationPageRoutingModule {}
