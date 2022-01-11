import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ClientService } from '../providers/client.service';
import { ModalController, Platform, LoadingController } from '@ionic/angular';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';

declare var google;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage implements OnInit 
{
	@ViewChild('gooeleMap')  mapElement: ElementRef;
	public language_selected = '';
	public default_language_data: any = [];
	
	public resultDataCategories: any = [];
	public resultDataDistricts: any = [];
	public resultDataCities: any = [];
	public resultDataProvince: any = [];
	public language_key_exchange_array: any = [];
	public language_key_exchange_district_array: any = [];
	public language_key_exchange_city_array: any = [];
	public language_key_exchange_province_array: any = [];

	public gooeleMap: any;
	public latitude:any='';
	public longitude:any='';
	public latitudeCenter:any='';
	public longitudeCenter:any='';
	public address:any='';

	public resultData:any = [];
	public id:any='';
	public role:any='';
	public profileForm = this.fb.group({
		first_name: ['', Validators.required],
		last_name: ['', Validators.required],
		email: ['',  [Validators.required, Validators.pattern("^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")]],    
		specialized_in: ['', Validators.required],
		//service_district: [''],
		//service_city: [''],
		service_province: ['', Validators.required],
		service_in_km: [''],
		price_per_hour: [''],
		experience_in_year: [''],
		latitude: [''],
		longitude: [''],
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
		],
		'specialized_in': 
		[
		  { type: 'required', message: 'Specialized In is required.' }
		]/*,
		'service_district': 
		[
		  { type: 'required', message: 'Selecting district is required.' }
		],
		'service_city': 
		[
		  { type: 'required', message: 'Selecting city is required.' }
		]*/,
		'experience_in_year': [
			{ type: 'required', message: 'Experience in year is required.' }
		],
		'price_per_hour': [
			{ type: 'required', message: 'Hourly price is required.' }
		],
		'service_province': [
		  { type: 'required', message: 'Selecting province is required.' }
		],
		'service_in_km': 
		[
		  { type: 'required', message: 'Range service is required.' }
		]
	};
  
  	constructor(public client: ClientService, public fb: FormBuilder, public loadingCtrl: LoadingController, public modalCtrl: ModalController, private geolocation: Geolocation, private platform: Platform, private nativeGeocoder: NativeGeocoder)
	{ 
		this.default_language_data = this.client.default_language_data;
		this.language_selected = this.client.language_selected;
		console.log("DATA",this.default_language_data);
		console.log("LANG",this.language_selected);
	}

	async ngOnInit()
	{ 
		this.language_key_exchange_array['english']='categoryName';
		this.language_key_exchange_array['arabic']='categoryNameArabic';
		this.language_key_exchange_array['kurdish']='categoryNameKurdi';

		this.language_key_exchange_district_array['english']='districtName';
		this.language_key_exchange_district_array['arabic']='districtNameArabic';
		this.language_key_exchange_district_array['kurdish']='districtNameKurdi';

		this.language_key_exchange_city_array['english']='cityName';
		this.language_key_exchange_city_array['arabic']='cityNameArabic';
		this.language_key_exchange_city_array['kurdish']='cityNameKurdi'; 
		
		this.language_key_exchange_province_array['english']='provinceName';
		this.language_key_exchange_province_array['arabic']='provinceNameArabic';
		this.language_key_exchange_province_array['kurdish']='provinceNameKurdi';

		//LOADER
		const loadingCategories = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loadingCategories.present();
		//LOADER
		await this.client.getCategories().then(result => 
		{	
			loadingCategories.dismiss();//DISMISS LOADER			
			this.resultDataCategories=result;
			console.log(this.resultDataCategories);
				
		},
		error => 
		{
			loadingCategories.dismiss();//DISMISS LOADER
			console.log();
		});//CATEGORIES

		//LOADER
		const loadingDestrict = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loadingDestrict.present();
		//LOADER
		await this.client.getDistricts().then(resultDistricts => 
		{	
		loadingDestrict.dismiss();//DISMISS LOADER			
		this.resultDataDistricts=resultDistricts;
		console.log(this.resultDataDistricts);
				
		},
		error => 
		{
		loadingDestrict.dismiss();//DISMISS LOADER
		console.log();
		});//DISTRICTS

		//LOADER
		const loadingProvince = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loadingProvince.present();
		//LOADER
		await this.client.getProvinces().then(resultProvinces => 
		{	
		loadingProvince.dismiss();//DISMISS LOADER			
		this.resultDataProvince=resultProvinces;
		console.log("Provinces",this.resultDataProvince);
				
		},
		error => 
		{
		loadingProvince.dismiss();//DISMISS LOADER
		console.log();
		});//Province

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
		this.role=localStorage.getItem('role');

		if(this.role == 'customer')
		{
			this.profileForm.controls['specialized_in'].setValue("");
			//this.profileForm.controls['service_district'].setValue("");
			//this.profileForm.controls['service_city'].setValue("");
			this.profileForm.controls['service_in_km'].setValue("");
			this.profileForm.controls['price_per_hour'].setValue("");
			this.profileForm.controls['experience_in_year'].setValue("");
			this.profileForm.get('specialized_in').clearValidators();     
			this.profileForm.get('specialized_in').updateValueAndValidity();
			//this.profileForm.get('service_district').clearValidators();     
			//this.profileForm.get('service_district').updateValueAndValidity();
			//this.profileForm.get('service_city').clearValidators();     
			//this.profileForm.get('service_city').updateValueAndValidity();      
			this.profileForm.get('experience_in_year').clearValidators();     
			this.profileForm.get('experience_in_year').updateValueAndValidity();
			this.profileForm.get('price_per_hour').clearValidators();     
			this.profileForm.get('price_per_hour').updateValueAndValidity();
			this.profileForm.get('service_province').clearValidators();     
			this.profileForm.get('service_province').updateValueAndValidity();
			this.profileForm.get('service_in_km').clearValidators();     
			this.profileForm.get('service_in_km').updateValueAndValidity();

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
				let service_province = (this.resultData.provinceID) ? this.resultData.provinceID : "";

				this.profileForm.controls['first_name'].setValue(firstName);
				this.profileForm.controls['last_name'].setValue(last_name);
				this.profileForm.controls['email'].setValue(email);
				this.profileForm.controls['service_province'].setValue(service_province);
							
			},
			error => 
			{
				loading.dismiss();//DISMISS LOADER
				console.log();
			});
		}
		if(this.role == 'handyman')
		{
			this.profileForm.get('specialized_in').setValidators([Validators.required]);     
			this.profileForm.get('specialized_in').updateValueAndValidity();
			//this.profileForm.get('service_district').setValidators([Validators.required]);     
			//this.profileForm.get('service_district').updateValueAndValidity();
			//this.profileForm.get('service_city').setValidators([Validators.required]);     
			//this.profileForm.get('service_city').updateValueAndValidity();
			this.profileForm.get('experience_in_year').setValidators([Validators.required]);     
			this.profileForm.get('experience_in_year').updateValueAndValidity();			
			this.profileForm.get('price_per_hour').setValidators([Validators.required]);     
			this.profileForm.get('price_per_hour').updateValueAndValidity();			
			this.profileForm.get('service_province').setValidators([Validators.required]);     
			this.profileForm.get('service_province').updateValueAndValidity();
			this.profileForm.get('service_in_km').setValidators([Validators.required]);     
			this.profileForm.get('service_in_km').updateValueAndValidity();

			let data = {
				id:this.id
			}
			await this.client.getHandymanDetailById(data).then(result => 
			{	
				loading.dismiss();//DISMISS LOADER			
				this.resultData=result;
				console.log(this.resultData);
				let firstName = (this.resultData.firstName) ? this.resultData.firstName : "";
				let last_name = (this.resultData.lastName) ? this.resultData.lastName : "";
				let email = (this.resultData.email) ? this.resultData.email : "";
				let province = (this.resultData.provinceID) ? this.resultData.provinceID : "";
				let price_per_hour = (this.resultData.price) ? this.resultData.price : "";
				let service_in_km = (this.resultData.rangeServing) ? this.resultData.rangeServing : 0;
				let experience_in_year = (this.resultData.no_of_experience) ? this.resultData.no_of_experience : 0;

				let specialized_in : any = [];
				if(this.resultData.categories.length > 0)
				{
					for(let c = 0 ; c < this.resultData.categories.length; c ++)
					{
						specialized_in.push(this.resultData.categories[c]['id']);
					}
				}
				console.log("specialized_in",specialized_in);
				this.profileForm.controls['first_name'].setValue(firstName);
				this.profileForm.controls['last_name'].setValue(last_name);
				this.profileForm.controls['email'].setValue(email);
				this.profileForm.controls['specialized_in'].setValue(specialized_in);
				this.profileForm.controls['service_province'].setValue(province);
				this.profileForm.controls['price_per_hour'].setValue(price_per_hour);
				this.profileForm.controls['service_in_km'].setValue(service_in_km);
				this.profileForm.controls['experience_in_year'].setValue(experience_in_year);
			},
			error => 
			{
				loading.dismiss();//DISMISS LOADER
				console.log();
			});
		}
	}

	async ionViewWillEnter()
	{
		this.platform.ready().then(async () => 
		{
			const coordinates = await this.geolocation.getCurrentPosition();
			if(this.resultData.latitude != '' && this.resultData.latitude != null && this.resultData.latitude != undefined && this.resultData.latitude != 'null' && this.resultData.latitude != 'undefined')
			{
				this.latitude=Number(this.resultData.latitude);
				this.longitude=Number(this.resultData.longitude);
			}
			else 
			{
				this.latitude=Number(coordinates.coords.latitude);
				this.longitude=Number(coordinates.coords.longitude);
			}
			this.JustAssignLatLonAsGlobal();
			
			//LOAD THE MAP WITH LATITUDE,LONGITUDE
			let latLng = new google.maps.LatLng(this.latitude, this.longitude);
			let mapOptions = 
			{
				center: latLng,
				zoom: 12,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				draggable: true,//THIS WILL NOW ALLOW MAP TO DRAG
				disableDefaultUI: true,//THIS WILL REMOVE THE ZOOM OPTION +/-
			} 
			this.gooeleMap = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
			this.gooeleMap.addListener('tilesloaded', () => 
			{
				this.latitudeCenter = this.gooeleMap.center.lat();
				this.longitudeCenter = this.gooeleMap.center.lng();
			});

			const myLatLng = { lat: this.latitude, lng: this.longitude };
			let image = 
			{
				url: './assets/images/marker-home1.png', // image is 512 x 512
				scaledSize: new google.maps.Size(60, 60),
			};
			
			let markerToReturn = new google.maps.Marker({
				draggable: true,
				position: myLatLng,
				map: this.gooeleMap,
				//animation: 'DROP',
				title: '',
				icon: image
			});
			
			//THIS PORTION ALLOW TO DRAG MARKER AND GET THE POSITION
			let classObj = this;//This is the class object we can say "SignUpPage"
			await google.maps.event.addListener(markerToReturn, 'dragend', function(this)//here "this" means "SignUpPage"
			{
				this.markerlatlong = markerToReturn.getPosition();        
				classObj.latitude=markerToReturn.getPosition().lat();
				classObj.longitude=markerToReturn.getPosition().lng();
				classObj.JustAssignLatLonAsGlobal();
				//console.log("latlong"+this.markerlatlong);
				//console.log("lat"+markerToReturn.getPosition().lat());
				//console.log("long"+markerToReturn.getPosition().lng());
			});//THIS PORTION ALLOW TO DRAG MARKER AND GET THE POSITION
			//LOAD THE MAP WITH LATITUDE,LONGITUDE
		});
	}
	JustAssignLatLonAsGlobal()
	{
		console.log(this.latitude);
		console.log(this.longitude);
		this.profileForm.controls['latitude'].setValue(this.latitude);
		this.profileForm.controls['longitude'].setValue(this.longitude);
		this.getAddressFromLatitudeAndLongitude(this.latitude, this.longitude);//THIS WILL GET ADDRESS ON BASES OF LATITUDE AND LONGITUDE
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
		console.log("Result",result);
		this.address = "";
		let responseAddress = [];      
		for (let [key, value] of Object.entries(result[0])) 
		{
			if(value.length>0)
			responseAddress.push(value); 
		}
		responseAddress.reverse();
		for (let value of responseAddress) 
		{
			this.address += value+", ";
		}
		this.address = this.address.slice(0, -2);
		console.log(this.address);
		}).catch((error: any) =>
		{ 
		this.address = "Address Not Available!";
		});
		//GET ADDRESS FROM LAT,LON
	}

  	dismissModal()
	{
		this.modalCtrl.dismiss({
			'dismissed': true
		});
  	}

	async updateProfile(form)
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

		let user_type = (this.role == 'handyman') ? 2 : 3;
    
		let first_name = (form.first_name) ? form.first_name : "";
		let last_name = (form.last_name) ? form.last_name : "";
		let email = (form.email) ? form.email : "";
		let password = (form.password) ? form.password : "";
		
		let specialized_in = (form.specialized_in) ? form.specialized_in.join(",") : "";
		let service_district = (form.service_district) ? form.service_district : "";
		let service_city = (form.service_city) ? form.service_city : "";
		let service_province = (form.service_province) ? form.service_province : "";
		let service_in_km = (form.service_in_km) ? form.service_in_km : 0;
		let price_per_hour = (form.price_per_hour) ? form.price_per_hour : 0;
		let experience_in_year = (form.experience_in_year) ? form.experience_in_year : 0;

		let data=
		{
			user_id:this.id,
			user_type:user_type,
			first_name:first_name,
			last_name:last_name,
			email:email, 
			password:password,
			specialized_in:specialized_in,
			service_district:service_district,
			service_city:service_city,
			service_province:service_province,
			service_in_km:service_in_km,
			price_per_hour:price_per_hour,
			experience_in_year:experience_in_year,
			latitude:this.latitude,
			longitude:this.longitude,
			address:this.address
		}
		await this.client.updateProfile(data).then(result => 
		{	
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
