import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ClientService } from '../providers/client.service';
import { LoadingController, Platform } from '@ionic/angular';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})

export class ForgotPasswordPage implements OnInit 
{
  	public language_selected = '';
	public default_language_data: any = [];

	public resultData:any={};
	
	public RecoverPasswordWithOTPForm = this.fb.group({
		phone_number: ['', Validators.required],
	});

	public forgotPasswordForm = this.fb.group({
		username: ['', Validators.required],
	});

	validation_recover_password_with_otp_messages = 
	{		
		'phone_number': 
		[
			{ type: 'required', message: 'Phone number is required.' }
		]
	};

  	validation_messages = 
	{		
		'username': 
		[
			{ type: 'required', message: 'Email is required.' },
			{ type: 'pattern', message: 'Please enter a valid email.' }
		]
	};

	public locationCordinates: any;//sign-in with otp
	public timestamp: any;//sign-in with otp
	public resultDataGeoCoding: any = [];//sign-in with otp
	public resultDataBeforeVerification:any = [];//sign-in with otp
	public resultDataAfterVerification:any = [];//sign-in with otp
	public countryName:any='';//sign-in with otp
	public isOTPSent:boolean=false;//sign-in with otp

	constructor(public client: ClientService, public fb: FormBuilder, public loadingCtrl: LoadingController, private platform: Platform, private locationAccuracy: LocationAccuracy, private geolocation: Geolocation, private androidPermissions: AndroidPermissions, private nativeGeocoder: NativeGeocoder)
	{ 
		this.default_language_data = this.client.default_language_data;
			this.language_selected = this.client.language_selected;
			console.log("DATA",this.default_language_data);
			console.log("LANG",this.language_selected);
	}

	ngOnInit()
	{ 
		this.locationCordinates = 
		{
			latitude: "",
			longitude: "",
			accuracy: "",
			timestamp: ""
		}
		this.timestamp = Date.now();
	}

	async resetMyPassword(form)
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
			username:form.username
		}
		await this.client.resetMyPassword(data).then(result => 
		{	
			loading.dismiss();//DISMISS LOADER			
			this.resultData=result;
			this.client.router.navigate(['/sign-in']);
			console.log(this.resultData);
						
		},
		error => 
		{
			loading.dismiss();//DISMISS LOADER
			console.log();
		});
	}

	async RecoverMyPasswordWithPhone(form)
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
		let user_country =  this.countryName;

		let data=
		{
			phone_number:form.phone_number,
			user_country:'India'//user_country
		}
		await this.client.recoverMyPasswordWithPhone(data).then(result => 
		{	
			loading.dismiss();//DISMISS LOADER			
			this.resultData=result;
			this.client.router.navigate(['/sign-in']);
			console.log(this.resultData);
						
		},
		error => 
		{
			loading.dismiss();//DISMISS LOADER
			console.log();
		});
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
}
