import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ClientService } from '../providers/client.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})

export class SignInPage implements OnInit 
{
	public language_selected = '';
	public default_language_data: any = [];

	public resultData:any={};
	public passwordType: string = 'password';
	public passwordIcon: string = 'eye-off';

	public loginForm = this.fb.group({
		username: ['', Validators.required],
		password: ['', Validators.required]
	});

  	validation_messages = 
	{		
		'username': 
		[
			{ type: 'required', message: 'Email is required.' },
			{ type: 'pattern', message: 'Please enter a valid email.' }
		],
		'password': 
		[
			{ type: 'required', message: 'Password is required.' }
		]
	};

	constructor(public client: ClientService, public fb: FormBuilder, public loadingCtrl: LoadingController)
	{ 
		this.default_language_data = this.client.default_language_data;
		this.language_selected = this.client.language_selected;
		console.log("DATA",this.default_language_data);
		console.log("LANG",this.language_selected);
	}

	ngOnInit()
	{ }

	ionViewWillEnter()
	{
		this.default_language_data = this.client.default_language_data;
		this.language_selected = this.client.language_selected;
	}
	
  	hideShowPassword()
	{
		this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    	this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
	}

	async makeMeLoggedin(form)
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
			username:form.username, 
			password:form.password,
		}
		await this.client.makeMeLoggedin(data).then(result => 
		{	
			loading.dismiss();//DISMISS LOADER			
			this.resultData=result;
			
			if(this.resultData.status==true)
			{
				this.client.publishSomeDataOnSignIn({
					should_menu_enable: true
				});//THIS OBSERVABLE IS USED TO KNOW IS ANY HAS SIGNIN
				localStorage.setItem('token',this.resultData.token);
				localStorage.setItem('id',this.resultData.id);
				localStorage.setItem('email',this.resultData.email);
				localStorage.setItem('userTypeID',this.resultData.userTypeID);
				localStorage.setItem('firstName',this.resultData.firstName);
				localStorage.setItem('lastName',this.resultData.lastName);
				localStorage.setItem('role',this.resultData.role);
				this.client.router.navigate(['/tabs/home']);
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
