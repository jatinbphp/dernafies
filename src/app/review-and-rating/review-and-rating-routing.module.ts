import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReviewAndRatingPage } from './review-and-rating.page';

const routes: Routes = [
  {
    path: '',
    component: ReviewAndRatingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewAndRatingPageRoutingModule {}
