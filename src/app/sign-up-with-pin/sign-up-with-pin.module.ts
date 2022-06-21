import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SignUpWithPinPageRoutingModule } from './sign-up-with-pin-routing.module';
import { SignUpWithPinPage } from './sign-up-with-pin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SignUpWithPinPageRoutingModule
  ],
  declarations: [SignUpWithPinPage]
})
export class SignUpWithPinPageModule {}
