import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ClientService } from '../providers/client.service';
import { ModalController, Platform, LoadingController, ActionSheetController } from '@ionic/angular';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { Chooser } from '@awesome-cordova-plugins/chooser/ngx';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

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
	public resultDataCategoriesResponse: any = [];
	public resultDataCategories: any = [];
	public resultDataDistricts: any = [];
	public resultDataCities: any = [];
	public resultDataProvince: any = [];
	public resultDataSubscriptionPlans: any = [];

	public resultDataMyCurrentSubscriptionPlan: any = [];
	public MyCurrentSubscriptionPlan: number = 0;

	public language_key_exchange_array: any = [];

	public language_key_exchange_district_array: any = [];
	public language_key_exchange_city_array: any = [];
	public language_key_exchange_province_array: any = [];
	public language_key_exchange_subscription_plan: any = [];

	public gooeleMap: any;
	public latitude:any='';
	public longitude:any='';
	public latitudeCenter:any='';
	public longitudeCenter:any='';
	public address:any='';

	public resultPricingTypes: any = [];
  	public show_unit_type:boolean = false;
	
	public resultData:any = [];
	public id:any='';
	public role:any='';

	private fileTransfer: FileTransferObject;
	public file_uri_camera: string;//IMAGE CAPTURED FROM CAMERA
	public selected_file_camera: string;//IMAGE CAPTURED FROM CAMERA
  	public sourse_file_path_camera: string;//IMAGE CAPTURED FROM CAMERA
  	public file_uri_gallery: string;//IMAGE CAPTURED FROM GALLERY
	public selected_file_gallery: string;//IMAGE CAPTURED FROM GALLERY
  	public sourse_file_path_gallery: string;//IMAGE CAPTURED FROM GALLERY

	public max_service_range:number=0;
	public max_service_range_km:any=[];
	public category_to_be_selected_limit:number=0;//For disabling checkbox after limit
	public checkeds = 0;//For disabling checkbox after limit
	public podecheck = true;//For disabling checkbox after limit

	public locationCordinates: any;
  	public timestamp: any;

	public profileForm = this.fb.group({
		first_name: ['', Validators.required],
		last_name: ['', Validators.required],
		email: ['',  [Validators.required, Validators.pattern("^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")]],    
		specialized_in: ['', Validators.required],
		//service_district: [''],
		//service_city: [''],
		service_province: ['', Validators.required],
		phone_number: ['', Validators.required],
		service_in_km: [''],
		pricing_type: [''],
    	unite_type: [''],
		price_per_hour: [''],
		experience_in_year: [''],
		latitude: [''],
		longitude: [''],
		file_uri_camera: [''],
		selected_file_camera: [''],
		sourse_file_path_camera: [''],
		file_uri_gallery: [''],
		selected_file_gallery: [''],
		sourse_file_path_gallery: [''],
		bio: [''],
		subscription_plan: [''],
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
		'pricing_type': [
			{ type: 'required', message: 'Pricing type is required.' }
		],
		'unite_type': [
			{ type: 'required', message: 'Unit type is required.' }
		],
		'service_province': [
		  { type: 'required', message: 'Selecting province is required.' }
		],
		'phone_number': [
		  { type: 'required', message: 'Phone number is required.' }
		],
		'service_in_km': 
		[
		  { type: 'required', message: 'Range service is required.' }
		],
		'subscription_plan': 
		[
		  { type: 'required', message: 'Selecting service plan is required.' }
		],
		'bio': 
		[
		  { type: 'required', message: 'Bio is required.' }
		]
	};
  
  	constructor(public client: ClientService, public fb: FormBuilder, public loadingCtrl: LoadingController, public modalCtrl: ModalController, private geolocation: Geolocation, private platform: Platform, private nativeGeocoder: NativeGeocoder, private camera: Camera, private file: File, private filePath: FilePath, private chooser: Chooser, private transfer: FileTransfer, private actionSheetController: ActionSheetController, private androidPermissions: AndroidPermissions, private locationAccuracy: LocationAccuracy)
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

		this.language_key_exchange_subscription_plan['english']='planName';
		this.language_key_exchange_subscription_plan['arabic']='planNameArabic';
		this.language_key_exchange_subscription_plan['kurdish']='planNameKurdish';

		
	}

	async ionViewWillEnter()
	{	
		//LOADER
		const loadingCategories = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		//await loadingCategories.present();
		//LOADER
		await this.client.getCategories().then(result => 
		{	
			loadingCategories.dismiss();//DISMISS LOADER			
			this.resultDataCategoriesResponse=result;
			console.log(this.resultDataCategoriesResponse);
			this.resultDataCategories=this.resultDataCategoriesResponse['data'];
			if(this.resultDataCategories.length > 0)
			{
				for(let c=0;c<this.resultDataCategories.length;c++)
				{
				this.resultDataCategories[c]['isChecked']=false;
				}
			}
			this.category_to_be_selected_limit=Number(this.resultDataCategoriesResponse['selection_limit']);
			this.max_service_range=Number(this.resultDataCategoriesResponse['range_serving']);
			if(this.max_service_range > 0)
			{
				for(let km = 1; km <= this.max_service_range; km ++)
				{
					this.max_service_range_km.push(km);
				}
			}
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
		//await loadingDestrict.present();
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
		//await loadingProvince.present();
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
		const loadingSubscriptionPlans = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		//await loadingSubscriptionPlans.present();
		//LOADER
		await this.client.getSubscriptionPlan().then(resultSubscription => 
		{	
			loadingSubscriptionPlans.dismiss();//DISMISS LOADER			
			this.resultDataSubscriptionPlans=resultSubscription;
			console.log("Subscriptions",this.resultDataSubscriptionPlans);
				
		},
		error => 
		{
			loadingSubscriptionPlans.dismiss();//DISMISS LOADER
			console.log();
		});//Subscriptions plans
		
		//LOADER
		const loadingPricingType = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		//await loadingPricingType.present();
		//LOADER
		await this.client.getPricingTypes().then(resultPricing => 
		{	
			loadingPricingType.dismiss();//DISMISS LOADER			
			this.resultPricingTypes=resultPricing;
			console.log("Pricing",this.resultPricingTypes);
				
		},
		error => 
		{
			loadingPricingType.dismiss();//DISMISS LOADER
			console.log();
		});//Pricing Types

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
			this.profileForm.controls['subscription_plan'].setValue("");
			this.profileForm.controls['bio'].setValue("");
			this.profileForm.controls['price_per_hour'].setValue("");
			this.profileForm.controls['pricing_type'].setValue("");
			this.profileForm.controls['unite_type'].setValue("");
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
			this.profileForm.get('pricing_type').clearValidators();     
			this.profileForm.get('pricing_type').updateValueAndValidity();
			this.profileForm.get('unite_type').clearValidators();     
			this.profileForm.get('unite_type').updateValueAndValidity();
			this.profileForm.get('service_province').clearValidators();     
			this.profileForm.get('service_province').updateValueAndValidity();
			this.profileForm.get('phone_number').clearValidators();     
			this.profileForm.get('phone_number').updateValueAndValidity();
			this.profileForm.get('service_in_km').clearValidators();     
			this.profileForm.get('service_in_km').updateValueAndValidity();
			this.profileForm.get('subscription_plan').clearValidators();     
			this.profileForm.get('subscription_plan').updateValueAndValidity();
			this.profileForm.get('bio').clearValidators();     
			this.profileForm.get('bio').updateValueAndValidity();

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
				let phone_number = (this.resultData.phoneNumber) ? this.resultData.phoneNumber : "";

				this.profileForm.controls['first_name'].setValue(firstName);
				this.profileForm.controls['last_name'].setValue(last_name);
				this.profileForm.controls['email'].setValue(email);
				this.profileForm.controls['service_province'].setValue(service_province);
				this.profileForm.controls['phone_number'].setValue(phone_number);
							
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
			this.profileForm.get('pricing_type').setValidators([Validators.required]);     
			this.profileForm.get('pricing_type').updateValueAndValidity();
			this.profileForm.get('unite_type').setValidators([Validators.required]);     
			this.profileForm.get('unite_type').updateValueAndValidity();			
			this.profileForm.get('service_province').setValidators([Validators.required]);     
			this.profileForm.get('service_province').updateValueAndValidity();
			this.profileForm.get('phone_number').setValidators([Validators.required]);     
			this.profileForm.get('phone_number').updateValueAndValidity();
			this.profileForm.get('service_in_km').setValidators([Validators.required]);     
			this.profileForm.get('service_in_km').updateValueAndValidity();
			this.profileForm.get('subscription_plan').setValidators([Validators.required]);     
			this.profileForm.get('subscription_plan').updateValueAndValidity();			
			this.profileForm.get('bio').setValidators([Validators.required]);     
			this.profileForm.get('bio').updateValueAndValidity();

			let data = {
				id:this.id
			}
			await this.client.getHandymanDetailById(data).then(result => 
			{	
				loading.dismiss();//DISMISS LOADER			
				this.resultData=result;
				this.resultDataMyCurrentSubscriptionPlan=this.resultData['handymanActiveSubscriptionPlansInfo'];
				console.log(this.resultDataMyCurrentSubscriptionPlan);
				console.log(this.resultData);
				let firstName = (this.resultData.firstName) ? this.resultData.firstName : "";
				let last_name = (this.resultData.lastName) ? this.resultData.lastName : "";
				let email = (this.resultData.email) ? this.resultData.email : "";
				let province = (this.resultData.provinceID) ? this.resultData.provinceID : "";
				let phone_number = (this.resultData.phoneNumber) ? this.resultData.phoneNumber : "";
				let price_per_hour = (this.resultData.price) ? this.resultData.price : "";
				let pricing_type = (this.resultData.pricingType) ? this.resultData.pricingType : 0;
				let unite_type = (this.resultData.unitPricingType) ? this.resultData.unitPricingType : "";
				let service_in_km = (this.resultData.rangeServing) ? this.resultData.rangeServing : 0;
				let subscription_plan = (this.resultDataMyCurrentSubscriptionPlan[0].subscriptionID) ? this.resultDataMyCurrentSubscriptionPlan[0].subscriptionID : 0;
				let bio = (this.resultData.bio) ? this.resultData.bio : "";
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
				this.profileForm.controls['phone_number'].setValue(phone_number);
				this.profileForm.controls['price_per_hour'].setValue(price_per_hour);
				this.profileForm.controls['pricing_type'].setValue(pricing_type);
				this.profileForm.controls['unite_type'].setValue(unite_type);
				this.profileForm.controls['service_in_km'].setValue(service_in_km);
				this.profileForm.controls['subscription_plan'].setValue(subscription_plan);
				this.profileForm.controls['bio'].setValue(bio);
				this.profileForm.controls['experience_in_year'].setValue(experience_in_year);
			},
			error => 
			{
				loading.dismiss();//DISMISS LOADER
				console.log();
			});
		}
		

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

	check(entry) 
	{
		if (!entry.isChecked)
		{
		this.checkeds++;
		console.log(this.checkeds);
		} 
		else 
		{
		this.checkeds--;
		console.log(this.checkeds);
		}
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
		let phone_number = (form.phone_number) ? form.phone_number : "";
		let service_in_km = (form.service_in_km) ? form.service_in_km : 0;
		//let subscription_plan = (form.subscription_plan) ? form.subscription_plan : 0;
		let bio = (form.bio) ? form.bio : "";
		let price_per_hour = (form.price_per_hour) ? form.price_per_hour : 0;
		let pricing_type = (form.pricing_type) ? form.pricing_type : 0;
		let unite_type = (form.unite_type) ? form.unite_type : "";
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
			phone_number:phone_number,
			service_in_km:service_in_km,
			//subscription_plan:subscription_plan,
			bio:bio,
			price_per_hour:price_per_hour,
			pricing_type:pricing_type,
			unite_type:unite_type,
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

	async chooseFromOption()
	{
		const actionSheet = await this.actionSheetController.create({
		header: 'Choose Option',
		cssClass: 'my-action-sheet',
		buttons: 
		[
			{
				text:"Camera",
				icon:"camera",
				cssClass:"",
				handler: () => 
				{
					this.pickFromCamera();
				}
			},
			{
				text: 'Gallery',
				icon: 'image',
				handler: () => 
				{
					this.pickFromGallery();
				}
			}
		]
		});
		await actionSheet.present();
	}

	async pickFromCamera()
	{
		const options: CameraOptions = 
		{
			quality: 100,      
			destinationType: this.camera.DestinationType.FILE_URI,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE
		};
		const tempImage = await this.camera.getPicture(options);
		const tempFilename = tempImage.substr(tempImage.lastIndexOf('/') + 1);
		const tempBaseFilesystemPath = tempImage.substr(0, tempImage.lastIndexOf('/') + 1);
		const newBaseFilesystemPath = this.file.dataDirectory;
		await this.file.copyFile(tempBaseFilesystemPath, tempFilename, newBaseFilesystemPath, tempFilename);
		const storedPhoto = newBaseFilesystemPath + tempFilename;
		console.log("StoredPhoto",storedPhoto);
		if(this.platform.is('android')) 
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
			this.filePath.resolveNativePath(storedPhoto).then(url => 
			{        
				// url is path of selected file
				var file_name = url.substring(url.lastIndexOf("/") + 1);			
				this.profileForm.controls['file_uri_camera'].setValue(storedPhoto);
				this.profileForm.controls['selected_file_camera'].setValue(file_name);
				this.profileForm.controls['sourse_file_path_camera'].setValue(url); 
				
				this.fileTransfer = this.transfer.create();
				let upload_options: FileUploadOptions = 
				{
					headers: { 'Authorization': localStorage.getItem('token') },
					fileKey: 'profilePic',
					chunkedMode: false,
					fileName: file_name,
				} 
				//OTHER PROFILE INFORMATION
				let specialized_in : any = [];
				if(this.role == 'handyman')
				{
					if(this.resultData.categories.length > 0)
					{
						for(let c = 0 ; c < this.resultData.categories.length; c ++)
						{
							specialized_in.push(this.resultData.categories[c]['id']);
						}
					}
				}
				let other_required_parameters = 
				{
					user_id:this.id,
					userTypeID:(this.role == 'handyman') ? 2 : 3,
					firstName:(this.resultData.firstName) ? this.resultData.firstName : "",
					lastName:(this.resultData.lastName) ? this.resultData.lastName : "",
					email:(this.resultData.email) ? this.resultData.email : "", 
					categoryID:specialized_in,
					districtID:"",
					cityID:"",
					provinceID:(this.resultData.provinceID) ? this.resultData.provinceID : "",
					phoneNumber:(this.resultData.phoneNumber) ? this.resultData.phoneNumber : "",
					rangeServing:(this.resultData.rangeServing) ? this.resultData.rangeServing : 0,
					price:(this.resultData.price) ? this.resultData.price : "",
					no_of_experience:(this.resultData.no_of_experience) ? this.resultData.no_of_experience : 0,
					latitude:this.latitude,
					longitude:this.longitude,
					location:this.address
				}
				upload_options.params = other_required_parameters;
				//OTHER PROFILE INFORMATION
				this.fileTransfer.upload(url,this.client.api_url+"updateProfile", upload_options, true).then((res) => 
				{
					loading.dismiss();//DISMISS LOADER
					this.client.showMessage('Profile picture is updated!');
					this.ionViewWillEnter();						
				}).catch((error) => 
				{
					loading.dismiss();//DISMISS LOADER
					this.client.showMessage("Error occured!!");
					//here logging an error. 
					console.log('upload failed: ' + JSON.stringify(error));
				})
			});
		}
		else
		{
			this.profileForm.controls['file_uri_camera'].setValue(tempFilename);
			this.profileForm.controls['selected_file_camera'].setValue(tempImage);
			this.profileForm.controls['sourse_file_path_camera'].setValue(tempImage);
			
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
			
			this.fileTransfer = this.transfer.create();
			let upload_options: FileUploadOptions = 
			{
				headers: { 'Authorization': localStorage.getItem('token') },
				fileKey: 'profilePic',
				chunkedMode: false,
				fileName: tempImage,
			}        
			//OTHER PROFILE INFORMATION
			let specialized_in : any = [];
			if(this.role == 'handyman')
			{
				if(this.resultData.categories.length > 0)
				{
					for(let c = 0 ; c < this.resultData.categories.length; c ++)
					{
						specialized_in.push(this.resultData.categories[c]['id']);
					}
				}
			}
			let other_required_parameters = 
			{
				user_id:this.id,
				userTypeID:(this.role == 'handyman') ? 2 : 3,
				firstName:(this.resultData.firstName) ? this.resultData.firstName : "",
				lastName:(this.resultData.lastName) ? this.resultData.lastName : "",
				email:(this.resultData.email) ? this.resultData.email : "", 
				categoryID:specialized_in,
				districtID:"",
				cityID:"",
				provinceID:(this.resultData.provinceID) ? this.resultData.provinceID : "",
				phoneNumber:(this.resultData.phoneNumber) ? this.resultData.phoneNumber : "",
				rangeServing:(this.resultData.rangeServing) ? this.resultData.rangeServing : 0,
				price:(this.resultData.price) ? this.resultData.price : "",
				no_of_experience:(this.resultData.no_of_experience) ? this.resultData.no_of_experience : 0,
				latitude:this.latitude,
				longitude:this.longitude,
				location:this.address
			}
			upload_options.params = other_required_parameters;
			//OTHER PROFILE INFORMATION
			this.fileTransfer.upload(tempImage,this.client.api_url+"updateProfile", upload_options, true).then((res) => 
			{
				loading.dismiss();//DISMISS LOADER
				this.client.showMessage('Profile picture is updated!');
				this.ionViewWillEnter();						
			}).catch((error) => 
			{
				loading.dismiss();//DISMISS LOADER
				this.client.showMessage("Error occured!!");
				//here logging an error. 
				console.log('upload failed: ' + JSON.stringify(error));
			})
		}
	}

	pickFromGallery()
	{
		(async () => {
			const file = await this.chooser.getFile();
			console.log(file ? file.name : 'canceled');
			console.log(file ? file.dataURI : 'canceled');
			console.log(file ? file.uri : 'canceled');
			//console.log('File chosen: ', file);
			this.uploadHandler(file.uri);
		})();
		/*
		this.chooser.getFile().then(file =>
		{	
			console.log(file ? file.name : 'canceled');
			console.log(file ? file.dataURI : 'canceled');
			console.log(file ? file.uri : 'canceled');
			//console.log('File chosen: ', file);
			this.uploadHandler(file.uri);
		})
		.catch(e => 
		{
			console.log('Error choosing file: ', e);
		});
		*/
	}

	async uploadHandler(uri) 
	{
		if(this.platform.is('android'))
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

			this.filePath.resolveNativePath(uri).then(url => 
			{
				// url is path of selected file
				var file_name = url.substring(url.lastIndexOf("/") + 1)
				
				this.profileForm.controls['file_uri_gallery'].setValue(uri);
				this.profileForm.controls['selected_file_gallery'].setValue(file_name);
        		this.profileForm.controls['sourse_file_path_gallery'].setValue(url);
        
				this.fileTransfer = this.transfer.create();
				let upload_options: FileUploadOptions = 
				{
					headers: { 'Authorization': localStorage.getItem('token') },
					fileKey: 'profilePic',
					chunkedMode: false,
					fileName: file_name,
				}        
				//OTHER PROFILE INFORMATION
				let specialized_in : any = [];
				if(this.role == 'handyman')
				{
					if(this.resultData.categories.length > 0)
					{
						for(let c = 0 ; c < this.resultData.categories.length; c ++)
						{
							specialized_in.push(this.resultData.categories[c]['id']);
						}
					}
				}
				let other_required_parameters = 
				{
					user_id:this.id,
					userTypeID:(this.role == 'handyman') ? 2 : 3,
					firstName:(this.resultData.firstName) ? this.resultData.firstName : "",
					lastName:(this.resultData.lastName) ? this.resultData.lastName : "",
					email:(this.resultData.email) ? this.resultData.email : "", 
					categoryID:specialized_in,
					districtID:"",
					cityID:"",
					provinceID:(this.resultData.provinceID) ? this.resultData.provinceID : "",
					phoneNumber:(this.resultData.phoneNumber) ? this.resultData.phoneNumber : "",
					rangeServing:(this.resultData.rangeServing) ? this.resultData.rangeServing : 0,
					price:(this.resultData.price) ? this.resultData.price : "",
					no_of_experience:(this.resultData.no_of_experience) ? this.resultData.no_of_experience : 0,
					latitude:this.latitude,
					longitude:this.longitude,
					location:this.address
				}
				upload_options.params = other_required_parameters;
				//OTHER PROFILE INFORMATION
				this.fileTransfer.upload(uri,this.client.api_url+"updateProfile", upload_options, true).then((res) => 
				{
					loading.dismiss();//DISMISS LOADER
					this.client.showMessage('Profile picture is updated!');
					this.ionViewWillEnter();			
				}).catch((error) => 
				{
					loading.dismiss();//DISMISS LOADER
					this.client.showMessage("Error occured!!");
					//here logging an error. 
					console.log('upload failed: ' + JSON.stringify(error));
				})
        
				loading.dismiss();//DISMISS LOADER								
				// fileName is selected file name
			}).catch(err => console.log(err));
		}
		else
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

			var file_name = uri.substring(uri.lastIndexOf("/") + 1);
			this.profileForm.controls['file_uri_gallery'].setValue(uri);
			this.profileForm.controls['selected_file_gallery'].setValue(file_name);
      		this.profileForm.controls['sourse_file_path_gallery'].setValue(uri);
      
			this.fileTransfer = this.transfer.create();
			let upload_options: FileUploadOptions = 
			{
				headers: { 'Authorization': localStorage.getItem('token') },
				fileKey: 'profilePic',
				chunkedMode: false,
				fileName: file_name,
			}        
			//OTHER PROFILE INFORMATION
			let specialized_in : any = [];
			if(this.role == 'handyman')
			{
				if(this.resultData.categories.length > 0)
				{
					for(let c = 0 ; c < this.resultData.categories.length; c ++)
					{
						specialized_in.push(this.resultData.categories[c]['id']);
					}
				}
			}
			let other_required_parameters = 
			{
				user_id:this.id,
				userTypeID:(this.role == 'handyman') ? 2 : 3,
				firstName:(this.resultData.firstName) ? this.resultData.firstName : "",
				lastName:(this.resultData.lastName) ? this.resultData.lastName : "",
				email:(this.resultData.email) ? this.resultData.email : "", 
				categoryID:specialized_in,
				districtID:"",
				cityID:"",
				provinceID:(this.resultData.provinceID) ? this.resultData.provinceID : "",
				phoneNumber:(this.resultData.phoneNumber) ? this.resultData.phoneNumber : "",
				rangeServing:(this.resultData.rangeServing) ? this.resultData.rangeServing : 0,
				price:(this.resultData.price) ? this.resultData.price : "",
				no_of_experience:(this.resultData.no_of_experience) ? this.resultData.no_of_experience : 0,
				latitude:this.latitude,
				longitude:this.longitude,
				location:this.address
			}
			upload_options.params = other_required_parameters;
			//OTHER PROFILE INFORMATION
			this.fileTransfer.upload(uri,this.client.api_url+"updateProfile", upload_options, true).then((res) => 
			{
				loading.dismiss();//DISMISS LOADER
				this.client.showMessage('Profile picture is updated!');	
				this.ionViewWillEnter();					
			}).catch((error) => 
			{
				loading.dismiss();//DISMISS LOADER
				this.client.showMessage("Error occured!!");
				//here logging an error. 
				console.log('upload failed: ' + JSON.stringify(error));
			})
			loading.dismiss();//DISMISS LOADER
		}	
  	}

	checkSelectedOptions(ev)
	{
		if(ev.detail!=null && ev.detail!=undefined && ev.detail!='null' && ev.detail!='undefined' && ev.detail.value.length > this.category_to_be_selected_limit)
		{
			let message = "<strong>You have crossed the maximum limit of selection!!</strong>";
			message += "<br />\n<br />\n";
			message += "The maximum allowed limit is "+this.category_to_be_selected_limit+" for <strong>"+this.default_language_data['translation'][0]['register'][0][this.language_selected][0]['specialized_in']+"</strong>."
			this.client.showMessage(message);
			let specialized_in : any = [];
			if(this.resultData.categories.length > 0)
			{
				for(let c = 0 ; c < this.resultData.categories.length; c ++)
				{
					specialized_in.push(this.resultData.categories[c]['id']);
				}
			}
			this.profileForm.controls['specialized_in'].setValue(specialized_in);
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
		

		if(this.resultData.latitude != '' && this.resultData.latitude != null && this.resultData.latitude != undefined && this.resultData.latitude != 'null' && this.resultData.latitude != 'undefined')
		{
			this.latitude=Number(this.resultData.latitude);
			this.longitude=Number(this.resultData.longitude);
		}
		else 
		{
			this.latitude=Number(this.locationCordinates.latitude);
			this.longitude=Number(this.locationCordinates.longitude);
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
	}

	checkPricingType(ev)
	{
		let PricintType = (ev.detail.value) ? ev.detail.value : 0;
		if(PricintType == 4)
		{
		this.show_unit_type = true;
		}
		else 
		{
		this.show_unit_type = false;
		}
	}
}
