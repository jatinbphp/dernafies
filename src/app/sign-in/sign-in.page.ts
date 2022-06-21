import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ClientService } from '../providers/client.service';
import { MenuController, LoadingController, Platform } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})

export class SignInPage implements OnInit 
{
	public language_selected = '';
	public default_language_data: any = [];
	public rtl_or_ltr = '';

	public resultData:any={};
	public resultDataOnExpirePlan:any={};
	public queryString: any=[];

	public passwordType: string = 'password';
	public passwordIcon: string = 'eye-off';

	public passwordPINType: string = 'password';
	public passwordPINIcon: string = 'eye-off';

	public is_remember_me_on:string="No";
	public unique_device_id:any = '';
	
	public loginWithOTPForm = this.fb.group({
		phone_number: ['', [Validators.required, Validators.minLength(4), Validators.pattern('^[0-9]+$')]],
	});

	public VerifyOTPForm = this.fb.group({
		phone_number: ['', Validators.required],
		otp: ['', Validators.required]
	});
	
	public loginWithPINForm = this.fb.group({
		four_digit_pin: ['', [Validators.required, Validators.minLength(4), Validators.pattern('^[0-9]+$')]],
	});
	
	public loginForm = this.fb.group({
		username: ['', Validators.required],
		password: ['', Validators.required]
	});

	validation_messages_otp = 
	{    
	'phone_number': [
		{ type: 'required', message: 'Phone number is required.' }
	],
	'otp': [
		{ type: 'required', message: 'OTP is required.' }
	]
	};

	validation_messages_four_digit_pin = 
	{		
		'four_digit_pin': 
		[
			{ type: 'required', message: '4 Digit pin is required.' },
			{ type: 'minlength', message: 'Pin should be of 4 numbers.' },
			{ type: 'pattern', message: 'Please enter a valid number.' }
		]
	};

	validation_messages_for_otp = 
	{		
		'phone_number': 
		[
			{ type: 'required', message: 'Phone number is required.' },
			{ type: 'pattern', message: 'Please enter a valid number.' }
		]
	};

  	validation_messages = 
	{		
		'username': 
		[
			{ type: 'required', message: 'Email is required.' },
			//{ type: 'pattern', message: 'Please enter a valid email.' }
		],
		'password': 
		[
			{ type: 'required', message: 'Password is required.' }
		]
	};

	public locationCordinates: any;//sign-in with otp
	public timestamp: any;//sign-in with otp
	public resultDataGeoCoding: any = [];//sign-in with otp
	public resultDataBeforeVerification:any = [];//sign-in with otp
	public resultDataAfterVerification:any = [];//sign-in with otp
	public countryName:any='';//sign-in with otp
	public isOTPSent:boolean=false;//sign-in with otp

	constructor(public client: ClientService, public fb: FormBuilder, public loadingCtrl: LoadingController, public menu: MenuController, private platform: Platform, private locationAccuracy: LocationAccuracy, private geolocation: Geolocation, private androidPermissions: AndroidPermissions, private nativeGeocoder: NativeGeocoder)
	{
		this.menu.enable(false);
		this.client.getObservableOnLanguageChange().subscribe((data) => {
			this.language_selected = data.language_selected;
			this.rtl_or_ltr = (this.language_selected == 'arabic') ? 'rtl' : 'ltr';
			console.log('Data received', data);
		});//THIS OBSERVABLE IS USED TO SET DEFAULT OR SELECTED LANGUAGE
		/*
		this.default_language_data = this.client.default_language_data;
		this.language_selected = this.client.language_selected;
		console.log("DATA",this.default_language_data);
		console.log("LANG",this.language_selected);
		*/
	}

	ngOnInit()
	{ 
		this.default_language_data = this.client.default_language_data;
		this.language_selected = this.client.language_selected;
		this.rtl_or_ltr = (this.language_selected == 'arabic') ? 'rtl' : 'ltr';
	}

	async ionViewWillEnter()
	{
		this.default_language_data = this.client.default_language_data;
		this.language_selected = this.client.language_selected;
		this.unique_device_id = localStorage.getItem('unique_device_id') ? localStorage.getItem('unique_device_id') : "";

		this.isOTPSent=false;
		this.locationCordinates = 
		{
			latitude: "",
			longitude: "",
			accuracy: "",
			timestamp: ""
		}
		this.timestamp = Date.now();
		await this.platform.ready().then(async () => 
		{
		if(this.platform.is("android") == true)
		{
			this.checkPermission();
		}
		else 
		{
			this.currentLocPosition();
		}
		});
	}
	
  	hideShowPassword()
	{
		this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    	this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
	}

	hideShowPasswordPIN()
	{
		this.passwordPINType = this.passwordPINType === 'text' ? 'password' : 'text';
    	this.passwordPINIcon = this.passwordPINIcon === 'eye-off' ? 'eye' : 'eye-off';
	}

	async makeMeLoggedin(form)
	{
		this.resultData=[];
		this.resultDataOnExpirePlan=[];
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
					should_menu_enable: true,
					role:this.resultData.role
				});//THIS OBSERVABLE IS USED TO KNOW IS ANY HAS SIGNIN
				
				localStorage.setItem('token',this.resultData.token);
				localStorage.setItem('id',this.resultData.id);
				localStorage.setItem('email',this.resultData.email);
				localStorage.setItem('userTypeID',this.resultData.userTypeID);
				localStorage.setItem('firstName',this.resultData.firstName);
				localStorage.setItem('lastName',this.resultData.lastName);
				localStorage.setItem('role',this.resultData.role);
				localStorage.setItem('remember_me',this.is_remember_me_on);
				this.client.router.navigate(['/tabs/home']);
			}
			if(this.resultData.status==false)
			{
				this.resultDataOnExpirePlan=this.resultData['lastSubscriptionPlan'];
				
				this.queryString = 
				{
					trademanID:this.resultDataOnExpirePlan['trademanID'],					
				};
				let navigationExtras: NavigationExtras = 
				{
					queryParams: 
					{
						special: JSON.stringify(this.queryString)
					}
				};
				this.client.router.navigate(['/renew-subscription'], navigationExtras);
			}
			//console.log(this.resultData);
			console.log(this.resultDataOnExpirePlan);			
		},
		error => 
		{
			loading.dismiss();//DISMISS LOADER
			console.log();
		});
	}

	changeDefaultLanguage(ev)
	{
		let language = ev.detail.value;
		localStorage.setItem('default_language',language);
		this.client.publishSomeDataOnLanguageChange({
			language_selected: language
		});//THIS OBSERVABLE IS USED TO SET DEFAULT OR SELECTED LANGUAGE
		//console.log(ev);
	}

	RememberMe(ev)
	{
		if(ev.detail.checked == true)
		{
			this.is_remember_me_on = "Yes";
		}
		if(ev.detail.checked == false)
		{
			this.is_remember_me_on = "No";
		}
		console.log(this.is_remember_me_on);
	}

	async SignupAsGuest(ev)
	{
		let four_digit_pin = (ev.detail.value) ? ev.detail.value : "";
		let four_digit_pin_length = four_digit_pin.length;
		if(four_digit_pin_length == 4 && !isNaN(four_digit_pin))
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
				four_digit_pin:four_digit_pin,
				unique_device_id:this.unique_device_id,
			}

			await this.client.SigninAsGuest(data).then(result => 
			{	
				loading.dismiss();//DISMISS LOADER			
				this.resultData=result;
				
				if(this.resultData.status==true)
				{
					this.client.publishSomeDataOnSignIn({
						should_menu_enable: true,
						role:this.resultData.role
					});//THIS OBSERVABLE IS USED TO KNOW IS ANY HAS SIGNIN
					
					localStorage.setItem('token',this.resultData.token);
					localStorage.setItem('id',this.resultData.id);
					localStorage.setItem('email',this.resultData.email);
					localStorage.setItem('userTypeID',this.resultData.userTypeID);
					localStorage.setItem('firstName',this.resultData.firstName);
					localStorage.setItem('lastName',this.resultData.lastName);
					localStorage.setItem('role',this.resultData.role);
					localStorage.setItem('remember_me',"Yes");
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

	checkPermission() 
	{
		this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
		result => {
			if (result.hasPermission) 
			{
			this.enableGPS();
			} 
			else 
			{
			this.locationAccPermission();
			}
		},
		error => {
			alert("1"+error);
		}
		);
	}

	locationAccPermission() 
	{
		this.locationAccuracy.canRequest().then((canRequest: boolean) => 
		{
		if (canRequest) {} 
		else 
		{
			this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
			.then(() => 
				{
				this.enableGPS();
				},
				error => 
				{
				alert("2"+error)
				}
			);
		}
		});
	}

	enableGPS() 
	{
		this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
		() => {
			this.currentLocPosition()
		},
		error => {
			alert("3"+JSON.stringify(error));
		}
		);
	}

	async currentLocPosition() 
	{
		await this.geolocation.getCurrentPosition().then((response) => 
		{
		this.locationCordinates.latitude = response.coords.latitude;
		this.locationCordinates.longitude = response.coords.longitude;
		this.locationCordinates.accuracy = response.coords.accuracy;
		this.locationCordinates.timestamp = response.timestamp;
		}).catch((error) => 
		{
		alert('4-Error: ' + error);
		});
		console.log(this.locationCordinates);
		this.getAddressFromLatitudeAndLongitude(this.locationCordinates.latitude, this.locationCordinates.longitude);//THIS WILL GET ADDRESS ON BASES OF LATITUDE AND LONGITUDE
	}

	async getAddressFromLatitudeAndLongitude(latitude_for_geocoder,longitude_for_geocoder)
	{
		//GET ADDRESS FROM LAT,LON
		//console.log("getAddressFromCoords "+latitude_for_geocoder+" "+longitude_for_geocoder);
		let options: NativeGeocoderOptions = 
		{
		useLocale: true,
		maxResults: 1    
		}; 
		await this.nativeGeocoder.reverseGeocode(latitude_for_geocoder, longitude_for_geocoder, options).then((result: NativeGeocoderResult[]) => 
		{
		//console.log(JSON.stringify(result[0]));      
		this.resultDataGeoCoding=result[0];
		this.countryName = this.resultDataGeoCoding['countryName'];
		}).catch((error: any) =>
		{ 
		console.log(error);
		});
		//GET ADDRESS FROM LAT,LON
	}

	async SigninWithOTP(form)
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

		let phone_number = (form.phone_number) ? form.phone_number : "";		
		let user_country =  this.countryName;  

		let objSignIn = 
		{
			phone_number:phone_number,
			user_country:user_country
		}
		await this.client.signInWithOTP(objSignIn).then(result => 
		{	
			loading.dismiss();//DISMISS LOADER			
			this.resultDataBeforeVerification=result;
			this.isOTPSent=true;
			
			if(this.resultDataBeforeVerification['status']==true)
			{
				this.VerifyOTPForm.controls['phone_number'].setValue(phone_number);
			}
		},
		error => 
		{
			loading.dismiss();//DISMISS LOADER
			console.log();
		});	
	}

	async verifyOTP(form)
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
		let phone_number = (form.phone_number) ? form.phone_number : "";
		let otp = (form.otp) ? form.otp : "";
		let objVerifyOTP = 
		{
		phone_number:phone_number,
		otp:otp
		}
		await this.client.verifyOTP(objVerifyOTP).then(result => 
		{	
		loading.dismiss();//DISMISS LOADER			
		this.resultDataAfterVerification=result;
		if(this.resultDataAfterVerification['status'] == true)
		{
			this.client.publishSomeDataOnSignIn({
				should_menu_enable: true,
				role:this.resultDataAfterVerification['role']
			});//THIS OBSERVABLE IS USED TO KNOW IS ANY HAS SIGNIN
			
			localStorage.setItem('token',(this.resultDataAfterVerification['token']) ? this.resultDataAfterVerification['token'] : "");
			localStorage.setItem('id',(this.resultDataAfterVerification['id']) ? this.resultDataAfterVerification['id'] : "");
			localStorage.setItem('email',(this.resultDataAfterVerification['email']) ? this.resultDataAfterVerification['email'] : "");
			localStorage.setItem('userTypeID',(this.resultDataAfterVerification['userTypeID']) ? this.resultDataAfterVerification['userTypeID'] : "");
			localStorage.setItem('firstName',(this.resultDataAfterVerification['firstName']) ? this.resultDataAfterVerification['firstName'] : "");
			localStorage.setItem('lastName',(this.resultDataAfterVerification['lastName']) ? this.resultDataAfterVerification['lastName'] : "");
			localStorage.setItem('role',(this.resultDataAfterVerification['role']) ? this.resultDataAfterVerification['role'] : "");
			localStorage.setItem('remember_me','No');

			this.client.router.navigate(['/tabs/home']);
			
		}//UPDATE TO PROFILE SCREEN
		},
		error => 
		{
		loading.dismiss();//DISMISS LOADER
		console.log();
		});
	}
}
