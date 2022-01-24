import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MessagesCustomerHandymanPageRoutingModule } from './messages-customer-handyman-routing.module';
import { MessagesCustomerHandymanPage } from './messages-customer-handyman.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MessagesCustomerHandymanPageRoutingModule
  ],
  declarations: [MessagesCustomerHandymanPage]
})
export class MessagesCustomerHandymanPageModule {}
