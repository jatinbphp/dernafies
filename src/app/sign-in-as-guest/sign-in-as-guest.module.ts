import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SignInAsGuestPageRoutingModule } from './sign-in-as-guest-routing.module';
import { SignInAsGuestPage } from './sign-in-as-guest.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SignInAsGuestPageRoutingModule
  ],
  declarations: [SignInAsGuestPage]
})
export class SignInAsGuestPageModule {}
