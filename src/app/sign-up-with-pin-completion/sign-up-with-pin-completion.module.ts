import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SignUpWithPinCompletionPageRoutingModule } from './sign-up-with-pin-completion-routing.module';
import { SignUpWithPinCompletionPage } from './sign-up-with-pin-completion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SignUpWithPinCompletionPageRoutingModule
  ],
  declarations: [SignUpWithPinCompletionPage]
})
export class SignUpWithPinCompletionPageModule {}
