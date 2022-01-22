import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CompleteTheJobPageRoutingModule } from './complete-the-job-routing.module';
import { CompleteTheJobPage } from './complete-the-job.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CompleteTheJobPageRoutingModule
  ],
  declarations: [CompleteTheJobPage]
})
export class CompleteTheJobPageModule {}
