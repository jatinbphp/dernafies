import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddJobPageRoutingModule } from './add-job-routing.module';
import { AddJobPage } from './add-job.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddJobPageRoutingModule
  ],
  declarations: [AddJobPage]
})
export class AddJobPageModule {}
