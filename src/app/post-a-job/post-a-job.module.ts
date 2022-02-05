import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostAJobPageRoutingModule } from './post-a-job-routing.module';

import { PostAJobPage } from './post-a-job.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostAJobPageRoutingModule
  ],
  declarations: [PostAJobPage]
})
export class PostAJobPageModule {}
