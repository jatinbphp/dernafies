import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ClientService } from '../providers/client.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-change-password-pin',
  templateUrl: './change-password-pin.page.html',
  styleUrls: ['./change-password-pin.page.scss'],
})

export class ChangePasswordPinPage implements OnInit 
{
  public language_selected = '';
	public default_language_data: any = [];
	public rtl_or_ltr = '';
  public resultData:any={};
  public user_id:any='';
  public passwordType: string = 'password';
  public passwordIcon: string = 'eye-off';
  public unique_device_id:any = '';
  
  public changePinForm = this.fb.group({				
		four_digit_pin: ['', [Validators.required, Validators.minLength(4), Validators.pattern('^[0-9]+$')]],
	});

  validation_messages = 
  {    
    'four_digit_pin': [
      { type: 'required', message: '4 Digit pin is required.' },
      { type: 'minlength', message: 'Pin should be of 4 numbers.' },
      { type: 'pattern', message: 'Please enter a valid number.' }
    ]
  };

  constructor(public client: ClientService, public fb: FormBuilder, public loadingCtrl: LoadingController)
  { 
    this.client.getObservableOnLanguageChange().subscribe((data) => {
			this.language_selected = data.language_selected;
			this.rtl_or_ltr = (this.language_selected == 'arabic') ? 'rtl' : 'ltr';
			console.log('Data received', data);
		});//THIS OBSERVABLE IS USED TO SET DEFAULT OR SELECTED LANGUAGE
  }

  ngOnInit()
  {
    this.default_language_data = this.client.default_language_data;
		this.language_selected = this.client.language_selected;
		this.rtl_or_ltr = (this.language_selected == 'arabic') ? 'rtl' : 'ltr';
  }

  async ionViewWillEnter()
  {
    this.unique_device_id = localStorage.getItem('unique_device_id') ? localStorage.getItem('unique_device_id') : "";
    this.user_id=localStorage.getItem('id');

    this.default_language_data = this.client.default_language_data;
		this.language_selected = this.client.language_selected;
  }

  hideShowPassword()
	{
		this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
	}

  async changePasswordPin(form)
  {
    //LOADER
		const loading = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loading.present();
		//LOADER

		let data=
		{
			user_id:this.user_id, 
			password:form.password,
		}
		await this.client.changePassword(data).then(result => 
		{	
			loading.dismiss();//DISMISS LOADER			
			this.resultData=result;
      if(this.resultData['status']==true)
      {
        this.client.showMessage(this.resultData['message']);
        this.client.router.navigate(['tabs/settings']);
      }
      console.log(this.resultData);
		},
		error => 
		{
			loading.dismiss();//DISMISS LOADER
			console.log();
		});
  }

}
