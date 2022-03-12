import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ClientService } from '../providers/client.service';
import { Platform, LoadingController } from '@ionic/angular';
import { InAppBrowser, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

declare var google;

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})

export class SignUpPage implements OnInit 
{
  @ViewChild('gooeleMap')  mapElement: ElementRef;
  public language_selected = '';
	public default_language_data: any = [];
  public resultData:any;
  public signup_as_handyman: boolean = false;
  public resultDataCategoriesResponse: any = [];
  public resultDataCategories: any = [];
  public resultDataDistricts: any = [];
  public resultDataCities: any = [];
  public resultDataProvince: any = [];
  public resultDataSubscriptionPlans: any = [];
  public language_key_exchange_array: any = [];
  public language_key_exchange_district_array: any = [];
  public language_key_exchange_city_array: any = [];
  public language_key_exchange_province_array: any = [];
  public language_key_exchange_subscription_plan: any = [];
  public resultPricingTypes: any = [];
  public show_unit_type:boolean = false;

  public gooeleMap: any;
  public latitude:any='';
  public longitude:any='';
  public latitudeCenter:any='';
  public longitudeCenter:any='';
  public address:any='';

  public passwordType: string = 'password';
  public passwordIcon: string = 'eye-off';
	public ConfirmPasswordType: string = 'password';
	public ConfirmPasswordIcon: string = 'eye-off';
  public accept_tems:boolean=false;

  public default_km:any='25';
  public max_service_range:number=0;
	public max_service_range_km:any=[];
	public category_to_be_selected_limit:number=0;//For disabling checkbox after limit
	public checkeds = 0;//For disabling checkbox after limit
	public podecheck = true;//For disabling checkbox after limit

  public PricintType: number = 0;//If this is 4 then show "unite_type" Field only  
  public locationCordinates: any;
  public timestamp: any;

  public registerForm = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['',  [Validators.required, Validators.pattern("^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")]],
    cpassword: ['', Validators.required],    
    password: ['', Validators.compose([
			Validators.required,
			Validators.minLength(8)
		])],
    specialized_in: [''],
    //service_district: [''],
    //service_city: [''],
    service_province: ['', Validators.required],
    phone_number: ['', Validators.required],
    service_in_km: [''],
    pricing_type: [''],
    unite_type: [''],
    currency_code: [''],
    price_per_hour: [''],
    experience_in_year: [''],
    bio: [''],
    latitude: [''],
    longitude: [''],
    subscription_plan: [''],
    },{validator: this.checkIfMatchingPasswords('password', 'cpassword')
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
    'password': 
    [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be 8 character long.' },
    ],
    'cpassword': 
    [
      { type: 'required', message: 'Confirm password is required.' },
      { type: 'minlength', message: 'Password must be 8 character long.' },
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
    'bio': [
			{ type: 'required', message: 'Bio is required.' }
		],    
		'currency_code': [
			{ type: 'required', message: 'Selecting currency is required.' }
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
    ]
  };
  constructor(public client: ClientService, public fb: FormBuilder, public loadingCtrl: LoadingController, private inAppBrowser: InAppBrowser, private geolocation: Geolocation, private platform: Platform, private nativeGeocoder: NativeGeocoder, private androidPermissions: AndroidPermissions, private locationAccuracy: LocationAccuracy)
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

    //LOADER
		const loading = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		//await loading.present();
		//LOADER
    await this.client.getCategories().then(result => 
    {	
      loading.dismiss();//DISMISS LOADER			
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
      loading.dismiss();//DISMISS LOADER
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
  }

  async ionViewWillEnter()
  {
    this.locationCordinates = 
    {
      latitude: "",
      longitude: "",
      accuracy: "",
      timestamp: ""
    }
    this.timestamp = Date.now();
    this.signup_as_handyman = false;
    if(this.signup_as_handyman == false)
    {
      this.registerForm.controls['specialized_in'].setValue("");
      //this.registerForm.controls['service_district'].setValue("");
      //this.registerForm.controls['service_city'].setValue("");
      this.registerForm.controls['service_in_km'].setValue("");
      this.registerForm.controls['price_per_hour'].setValue("");
      this.registerForm.controls['currency_code'].setValue("");
      this.registerForm.controls['pricing_type'].setValue("");
      this.registerForm.controls['unite_type'].setValue("");
      this.registerForm.controls['experience_in_year'].setValue("");
      this.registerForm.controls['bio'].setValue("");
      this.registerForm.get('specialized_in').clearValidators();     
      this.registerForm.get('specialized_in').updateValueAndValidity();
      //this.registerForm.get('service_district').clearValidators();     
      //this.registerForm.get('service_district').updateValueAndValidity();
      //this.registerForm.get('service_city').clearValidators();     
      //this.registerForm.get('service_city').updateValueAndValidity();      
      this.registerForm.get('experience_in_year').clearValidators();     
			this.registerForm.get('experience_in_year').updateValueAndValidity();
      this.registerForm.get('bio').clearValidators();     
			this.registerForm.get('bio').updateValueAndValidity();
      this.registerForm.get('price_per_hour').clearValidators();     
			this.registerForm.get('price_per_hour').updateValueAndValidity();
      this.registerForm.get('currency_code').clearValidators();     
			this.registerForm.get('currency_code').updateValueAndValidity();
      this.registerForm.get('pricing_type').clearValidators();     
			this.registerForm.get('pricing_type').updateValueAndValidity();
      this.registerForm.get('unite_type').clearValidators();     
			this.registerForm.get('unite_type').updateValueAndValidity();
      this.registerForm.get('service_province').clearValidators();     
      this.registerForm.get('service_province').updateValueAndValidity();
      this.registerForm.get('phone_number').clearValidators();     
      this.registerForm.get('phone_number').updateValueAndValidity();      
      this.registerForm.get('service_in_km').clearValidators();     
      this.registerForm.get('service_in_km').updateValueAndValidity();
    }//DEFAULT CONFIGURATIN FOR CUSTOMER
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
    this.registerForm.controls['latitude'].setValue(this.latitude);
    this.registerForm.controls['longitude'].setValue(this.longitude);
    this.getAddressFromLatitudeAndLongitude(this.latitude, this.longitude);//THIS WILL GET ADDRESS ON BASES OF LATITUDE AND LONGITUDE
  }

  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string)
	{
		return (group: FormGroup) => 
		{
	    let passwordInput = group.controls[passwordKey],passwordConfirmationInput = group.controls[passwordConfirmationKey];
			if (passwordInput.value !== passwordConfirmationInput.value)
			{
        return passwordConfirmationInput.setErrors({notEquivalent: true})
      }      
			else
			{
	      return passwordConfirmationInput.setErrors(null);        
	    }
	  }
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

  acceptTerms(ev)
  {
    let haveStatus = ev.detail.checked;
    if(haveStatus == true)
    {
      this.accept_tems = true;
    }
    else 
    {
      this.accept_tems = false;
    }
  }

  async makeMeRegistered(form)
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
    
    let user_type = (this.signup_as_handyman == true) ? 2 : 3;
    
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
    let price_per_hour = (form.price_per_hour) ? form.price_per_hour : 0;
    let currency_code = (form.currency_code) ? form.currency_code : "";

    let pricing_type = (form.pricing_type) ? form.pricing_type : "";
    let unite_type = (form.unite_type) ? form.unite_type : "";
    let experience_in_year = (form.experience_in_year) ? form.experience_in_year : 0;
    let bio = (form.bio) ? form.bio : "";
    let subscription_plan = (form.subscription_plan) ? form.subscription_plan : 0;
		let data=
		{
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
      price_per_hour:price_per_hour,
      currency_code:currency_code,
      pricing_type:pricing_type,
      unite_type:unite_type,
      experience_in_year:experience_in_year,
      bio:bio,
      latitude:this.latitude,
      longitude:this.longitude,
      address:this.address,
      subscription_plan:subscription_plan
		}
    
		await this.client.makeMeRegistered(data).then(result => 
		{	
			loading.dismiss();//DISMISS LOADER			
			this.resultData=result;
			if(this.resultData.status==true)
			{
				this.client.router.navigate(['/sign-in']);
			}
			console.log(this.resultData);
						
		},
		error => 
		{
			loading.dismiss();//DISMISS LOADER
			console.log();
		});		
  }

  openActionRequested(targetUrl)
	{
		const options : InAppBrowserOptions = {
        location : 'yes',//Or 'no' 
        hidden : 'no', //Or  'yes'
        clearcache : 'yes',
        clearsessioncache : 'yes',
        zoom : 'yes',//Android only ,shows browser zoom controls 
        hardwareback : 'yes',
        mediaPlaybackRequiresUserAction : 'no',
        shouldPauseOnSuspend : 'no', //Android only 
        closebuttoncaption : 'Close', //iOS only
        disallowoverscroll : 'no', //iOS only 
        toolbar : 'yes', //iOS only 
        enableViewportScale : 'no', //iOS only 
        allowInlineMediaPlayback : 'no',//iOS only 
        presentationstyle : 'pagesheet',//iOS only 
        fullscreen : 'yes',//Windows only    
	    };
	    let target = "_system";
	    this.inAppBrowser.create(targetUrl,target,options);
	}

  signupAsHandyman(ev)
  {
    this.signup_as_handyman = ev.detail.checked;
    if(this.signup_as_handyman == true)
    {
      this.registerForm.get('specialized_in').setValidators([Validators.required]);     
      this.registerForm.get('specialized_in').updateValueAndValidity();

      //this.registerForm.get('service_district').setValidators([Validators.required]);     
      //this.registerForm.get('service_district').updateValueAndValidity();

      //this.registerForm.get('service_city').setValidators([Validators.required]);     
      //this.registerForm.get('service_city').updateValueAndValidity();

      this.registerForm.get('experience_in_year').setValidators([Validators.required]);     
			this.registerForm.get('experience_in_year').updateValueAndValidity();

      this.registerForm.get('bio').setValidators([Validators.required]);     
			this.registerForm.get('bio').updateValueAndValidity();
      
      this.registerForm.get('price_per_hour').setValidators([Validators.required]);     
			this.registerForm.get('price_per_hour').updateValueAndValidity();

      this.registerForm.get('currency_code').setValidators([Validators.required]);     
			this.registerForm.get('currency_code').updateValueAndValidity();

      this.registerForm.get('pricing_type').setValidators([Validators.required]);     
			this.registerForm.get('pricing_type').updateValueAndValidity();
      
      this.registerForm.get('service_province').setValidators([Validators.required]);     
      this.registerForm.get('service_province').updateValueAndValidity();

      this.registerForm.get('phone_number').setValidators([Validators.required]);     
      this.registerForm.get('phone_number').updateValueAndValidity();

      this.registerForm.get('service_in_km').setValidators([Validators.required]);     
      this.registerForm.get('service_in_km').updateValueAndValidity();

      this.registerForm.get('subscription_plan').setValidators([Validators.required]);     
      this.registerForm.get('subscription_plan').updateValueAndValidity();

      this.registerForm.controls['service_in_km'].setValue(this.default_km);
    }
    if(this.signup_as_handyman == false)
    {
      this.registerForm.controls['specialized_in'].setValue("");
      //this.registerForm.controls['service_district'].setValue("");
      //this.registerForm.controls['service_city'].setValue("");
      this.registerForm.controls['service_in_km'].setValue("");
      this.registerForm.controls['subscription_plan'].setValue("");
      this.registerForm.controls['price_per_hour'].setValue("");
      this.registerForm.controls['currency_code'].setValue("");
      this.registerForm.controls['pricing_type'].setValue("");
      this.registerForm.controls['unite_type'].setValue("");
      this.registerForm.controls['experience_in_year'].setValue("");
      this.registerForm.get('specialized_in').clearValidators();     
      this.registerForm.get('specialized_in').updateValueAndValidity();
      //this.registerForm.get('service_district').clearValidators();     
      //this.registerForm.get('service_district').updateValueAndValidity();
      //this.registerForm.get('service_city').clearValidators();     
      //this.registerForm.get('service_city').updateValueAndValidity();      
      this.registerForm.get('experience_in_year').clearValidators();     
			this.registerForm.get('experience_in_year').updateValueAndValidity();
      this.registerForm.get('bio').clearValidators();     
			this.registerForm.get('bio').updateValueAndValidity();
      this.registerForm.get('price_per_hour').clearValidators();     
			this.registerForm.get('price_per_hour').updateValueAndValidity();
      this.registerForm.get('currency_code').clearValidators();     
			this.registerForm.get('currency_code').updateValueAndValidity();
      this.registerForm.get('pricing_type').clearValidators();     
			this.registerForm.get('pricing_type').updateValueAndValidity();
      this.registerForm.get('service_province').clearValidators();     
      this.registerForm.get('service_province').updateValueAndValidity();
      this.registerForm.get('phone_number').clearValidators();     
      this.registerForm.get('phone_number').updateValueAndValidity();
      this.registerForm.get('service_in_km').clearValidators();     
      this.registerForm.get('service_in_km').updateValueAndValidity();
      this.registerForm.get('subscription_plan').clearValidators();     
      this.registerForm.get('subscription_plan').updateValueAndValidity();
    }
    console.log(this.signup_as_handyman);
  }
  
  async showCitiesBasedOnDistrict(ev)
  {
    let selectedDistrict = ev.detail.value;
    if(selectedDistrict!='' && selectedDistrict!=null && selectedDistrict!=undefined && selectedDistrict!='null' && selectedDistrict!='undefined')
    {
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
      let data = {
        districtID: selectedDistrict
      }
      await this.client.showCitiesBasedOnDistrict(data).then(resultDistricts => 
      {	
        loadingDestrict.dismiss();//DISMISS LOADER			
        this.resultDataCities=resultDistricts;
        console.log(this.resultDataCities);            
      },
      error => 
      {
        loadingDestrict.dismiss();//DISMISS LOADER
        console.log();
      });//DISTRICTS
    }
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

  checkSelectedOptions(ev)
  {
    if(ev.detail!=null && ev.detail!=undefined && ev.detail!='null' && ev.detail!='undefined' && ev.detail.value.length > this.category_to_be_selected_limit)
    {
      let message = "<strong>You have crossed the maximum limit of selection!!</strong>";
      message += "<br />\n<br />\n";
      message += "The maximum allowed limit is "+this.category_to_be_selected_limit+" for <strong>"+this.default_language_data['translation'][0]['register'][0][this.language_selected][0]['specialized_in']+"</strong>."
      this.client.showMessage(message);
      this.registerForm.controls['specialized_in'].setValue("");
      this.registerForm.get('specialized_in').clearValidators();     
      this.registerForm.get('specialized_in').updateValueAndValidity();
      this.registerForm.get('specialized_in').setValidators([Validators.required]);     
      this.registerForm.get('specialized_in').updateValueAndValidity();
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
    
    this.latitude=Number(this.locationCordinates.latitude);
    this.longitude=Number(this.locationCordinates.longitude);

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
    this.PricintType = (ev.detail.value) ? ev.detail.value : 0;
    if(this.PricintType == 4)
    {
      this.registerForm.get('unite_type').setValidators([Validators.required]);     
			this.registerForm.get('unite_type').updateValueAndValidity();
      this.show_unit_type = true;
    }
    else 
    {
      this.registerForm.get('unite_type').clearValidators();     
			this.registerForm.get('unite_type').updateValueAndValidity();
      this.PricintType = 0;
      this.show_unit_type = false;
    }
  }
}
