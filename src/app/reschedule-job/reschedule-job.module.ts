import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RescheduleJobPageRoutingModule } from './reschedule-job-routing.module';
import { RescheduleJobPage } from './reschedule-job.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RescheduleJobPageRoutingModule
  ],
  declarations: [RescheduleJobPage]
})
export class RescheduleJobPageModule {}
