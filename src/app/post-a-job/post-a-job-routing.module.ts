import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostAJobPage } from './post-a-job.page';

const routes: Routes = [
  {
    path: '',
    component: PostAJobPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostAJobPageRoutingModule {}
