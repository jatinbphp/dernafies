import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MessagesCustomerHandymanPageRoutingModule } from './messages-customer-handyman-routing.module';
import { MessagesCustomerHandymanPage } from './messages-customer-handyman.page';
import { MomentModule } from 'angular2-moment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    IonicModule,
    MessagesCustomerHandymanPageRoutingModule
  ],
  declarations: [MessagesCustomerHandymanPage]
})
export class MessagesCustomerHandymanPageModule {}
