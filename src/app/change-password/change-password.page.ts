import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ClientService } from '../providers/client.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})

export class ChangePasswordPage implements OnInit 
{
  public language_selected = '';
	public default_language_data: any = [];
	public rtl_or_ltr = '';
  public resultData:any={};

  public user_id:any='';
  public passwordType: string = 'password';
  public passwordIcon: string = 'eye-off';
	public ConfirmPasswordType: string = 'password';
	public ConfirmPasswordIcon: string = 'eye-off';

  
  public changePasswordForm = this.fb.group({		
		cpassword: ['', Validators.compose([
			Validators.required,
			Validators.minLength(8)
		])],		
		password: ['', Validators.compose([
			Validators.required,
			Validators.minLength(8)
		])],
	},{validator: this.checkPasswordMatches('cpassword','password')});  
  

  validation_messages = 
  {    
    'password': 
    [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be 8 character long.' },
    ],
    'cpassword': 
    [
      { type: 'required', message: 'Confirm password is required.' },
      { type: 'minlength', message: 'Password must be 8 character long.' },
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

  ionViewWillEnter()
	{
		this.default_language_data = this.client.default_language_data;
		this.language_selected = this.client.language_selected;
    this.user_id=localStorage.getItem('id');
	}

  hideShowPassword()
	{
		this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
	}

	hideShowConfirmPassword()
	{
		this.ConfirmPasswordType = this.ConfirmPasswordType === 'text' ? 'password' : 'text';
    this.ConfirmPasswordIcon = this.ConfirmPasswordIcon === 'eye-off' ? 'eye' : 'eye-off';
	}

  checkPasswordMatches(passwordMain: string, confirmPassword: string) 
	{
		return (group: FormGroup) => 
		{
			let passwordInput = group.controls[passwordMain],
			passwordConfirmationInput = group.controls[confirmPassword];
			if(passwordInput.value!="" && passwordConfirmationInput.value!="")
			{
				if (passwordInput.value !== passwordConfirmationInput.value) 
				{
					return passwordConfirmationInput.setErrors({notEquivalent: true});
				}
				else
				{
					return passwordConfirmationInput.setErrors(null);
				}
			}
		}
	}

  async changePassword(form)
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
