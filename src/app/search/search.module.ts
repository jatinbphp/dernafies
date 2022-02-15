import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchPage } from './search.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { SearchPageRoutingModule } from './search-routing.module';
import { IonicRatingComponentModule } from 'ionic-rating-component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ExploreContainerComponentModule,
    IonicRatingComponentModule,
    RouterModule.forChild([{ path: '', component: SearchPage }]),
    SearchPageRoutingModule,
  ],
  declarations: [SearchPage]
})
export class SearchPageModule {}
