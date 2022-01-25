import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { HomePageRoutingModule } from './home-routing.module';
import { IonicRatingComponentModule } from 'ionic-rating-component';
import { MomentModule } from 'angular2-moment';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicRatingComponentModule,
    MomentModule,
    ExploreContainerComponentModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
