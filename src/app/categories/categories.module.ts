import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriesPage } from './categories.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { CategoriesPageRoutingModule } from './categories-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    CategoriesPageRoutingModule
  ],
  declarations: [CategoriesPage]
})
export class CategoriesPageModule {}
