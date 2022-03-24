import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChangePasswordPinPageRoutingModule } from './change-password-pin-routing.module';
import { ChangePasswordPinPage } from './change-password-pin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ChangePasswordPinPageRoutingModule
  ],
  declarations: [ChangePasswordPinPage]
})
export class ChangePasswordPinPageModule {}
