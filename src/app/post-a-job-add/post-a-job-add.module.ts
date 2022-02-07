import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PostAJobAddPageRoutingModule } from './post-a-job-add-routing.module';
import { PostAJobAddPage } from './post-a-job-add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PostAJobAddPageRoutingModule
  ],
  declarations: [PostAJobAddPage]
})
export class PostAJobAddPageModule {}
