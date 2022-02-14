import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RenewSubscriptionPageRoutingModule } from './renew-subscription-routing.module';
import { RenewSubscriptionPage } from './renew-subscription.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RenewSubscriptionPageRoutingModule
  ],
  declarations: [RenewSubscriptionPage]
})
export class RenewSubscriptionPageModule {}
