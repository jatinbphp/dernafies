import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ClientService } from '../providers/client.service';
import { Platform, LoadingController, ModalController } from '@ionic/angular';
import { InAppBrowser, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { SignUpWithPinCompletionPage } from '../sign-up-with-pin-completion/sign-up-with-pin-completion.page';

@Component({
  selector: 'app-sign-up-with-pin',
  templateUrl: './sign-up-with-pin.page.html',
  styleUrls: ['./sign-up-with-pin.page.scss'],
})

export class SignUpWithPinPage implements OnInit 
{
  public language_selected = '';
	public default_language_data: any = [];
  public accept_tems:boolean=false;
  public signup_as_handyman: boolean = false;
  public user_type:number=0;
  public locationCordinates: any;
  public timestamp: any;
  public resultDataGeoCoding: any = [];
  public resultDataBeforeVerification:any = [];
  public resultDataAfterVerification:any = [];
  public countryName:any='';
  public isOTPSent:boolean=false;
  public registerForm = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],    
    phone_number: ['', Validators.required],
    user_type: ['', Validators.required],
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
    'phone_number': [
      { type: 'required', message: 'Phone number is required.' }
    ],
    'user_type': [
      { type: 'required', message: 'Signup type is required.' }
    ]
  };

  public VerifyOTPForm = this.fb.group({
    phone_number: ['', Validators.required],
    otp: ['', Validators.required]
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

  constructor(public client: ClientService, public fb: FormBuilder, public loadingCtrl: LoadingController, private inAppBrowser: InAppBrowser, private platform: Platform, private locationAccuracy: LocationAccuracy, private geolocation: Geolocation, private androidPermissions: AndroidPermissions, private nativeGeocoder: NativeGeocoder, public modalCtrl: ModalController, private zone: NgZone)
  {
    this.default_language_data = this.client.default_language_data;
		this.language_selected = this.client.language_selected;
  }

  ngOnInit() 
  {}

  async ionViewWillEnter()
  {
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
  signupAsHandyman(ev)
  {
    this.signup_as_handyman = ev.detail.checked;    
    this.user_type = ev.detail.value;    
    console.log(this.user_type);
  }

  async signUpWithOTP(form)
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

    let first_name = (form.first_name) ? form.first_name : "";
    let last_name = (form.last_name) ? form.last_name : "";
    let phone_number = (form.phone_number) ? form.phone_number : "";    
    let user_type = (form.user_type) ? form.user_type : "";
    let user_country =  this.countryName;  

    let objRegistration = {
      first_name:first_name,
      last_name:last_name,
      user_type:user_type,
      phone_number:phone_number,
      user_country:user_country
    }
    await this.client.signUpWithOTP(objRegistration).then(result => 
    {	
      loading.dismiss();//DISMISS LOADER			
      this.resultDataBeforeVerification=result;
      this.isOTPSent=true;
      
      if(this.resultDataBeforeVerification['status']==true && this.resultDataBeforeVerification['data']['phoneNumber']!='')
      {
        this.VerifyOTPForm.controls['phone_number'].setValue(this.resultDataBeforeVerification['data']['phoneNumber']);
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
				if(this.resultDataAfterVerification['userProfileStatus'] == 0)
        {
          this.zone.run(async() => 
          {
            const modal = await this.modalCtrl.create({
              component: SignUpWithPinCompletionPage,
              componentProps: 
              { 
                id:this.resultDataAfterVerification['id'],
                role:this.resultDataAfterVerification['role']
              }
            });
            return await modal.present();
          });
        }
        else 
        {
          this.client.router.navigate(['/tabs/home']);
        }
      }//UPDATE TO PROFILE SCREEN
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });
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
