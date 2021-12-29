import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ClientService } from '../providers/client.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage implements OnInit 
{
	public language_selected = '';
	public default_language_data: any = [];
	public resultData:any;
	public id:any='';
	public profileForm = this.fb.group({
		first_name: ['', Validators.required],
		last_name: ['', Validators.required],
		email: ['',  [Validators.required, Validators.pattern("^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")]],    
	});

	validation_messages = 
	{    
		'first_name': 
		[
			{ type: 'required', message: 'First name is required.' }
		],
		'last_name': 
		[
			{ type: 'required', message: 'Last name is required.' }
		],
		'email': 
		[
			{ type: 'required', message: 'Email is required.' },
			{ type: 'pattern', message: 'Please enter a valid email.' }
		]
	};
  
  	constructor(public client: ClientService, public fb: FormBuilder, public loadingCtrl: LoadingController, public modalCtrl: ModalController)
	{ 
		this.default_language_data = this.client.default_language_data;
		this.language_selected = this.client.language_selected;
		console.log("DATA",this.default_language_data);
		console.log("LANG",this.language_selected);
	}

	async ngOnInit()
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
		this.id=localStorage.getItem('id');
		let data = {
			user_id:this.id
		}
		await this.client.getUserDetailById(data).then(result => 
		{	
			loading.dismiss();//DISMISS LOADER			
			this.resultData=result;
			console.log(this.resultData);
			let firstName = (this.resultData.firstName) ? this.resultData.firstName : "";
			let last_name = (this.resultData.lastName) ? this.resultData.lastName : "";
			let email = (this.resultData.email) ? this.resultData.email : "";

			this.profileForm.controls['first_name'].setValue(firstName);
			this.profileForm.controls['last_name'].setValue(last_name);
			this.profileForm.controls['email'].setValue(email);
						
		},
		error => 
		{
			loading.dismiss();//DISMISS LOADER
			console.log();
		});
	}

  	dismissModal()
	{
		this.modalCtrl.dismiss({
			'dismissed': true
		});
  	}

	async updateMyProfile(form)
	{
		console.log(form);
		return false;
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
			user_id:this.id,
			firstname:form.firstname,
			lastname:form.lastname,
			username:form.username, 
			password:form.password,
		}
		await this.client.updateProfile(data).then(result => 
		{	
			this.profileForm.controls['password'].setValue("");
			loading.dismiss();//DISMISS LOADER			
			this.ngOnInit();
						
		},
		error => 
		{
			loading.dismiss();//DISMISS LOADER
			console.log();
		});
	}
}
