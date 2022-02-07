import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostAJobAddPage } from './post-a-job-add.page';

const routes: Routes = [
  {
    path: '',
    component: PostAJobAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostAJobAddPageRoutingModule {}
