import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostAJobLocationPageRoutingModule } from './post-a-job-location-routing.module';

import { PostAJobLocationPage } from './post-a-job-location.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostAJobLocationPageRoutingModule
  ],
  declarations: [PostAJobLocationPage]
})
export class PostAJobLocationPageModule {}
