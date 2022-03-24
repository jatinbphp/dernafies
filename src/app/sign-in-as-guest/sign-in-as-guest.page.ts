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
  selector: 'app-sign-in-as-guest',
  templateUrl: './sign-in-as-guest.page.html',
  styleUrls: ['./sign-in-as-guest.page.scss'],
})

export class SignInAsGuestPage implements OnInit 
{
  @ViewChild('gooeleMap')  mapElement: ElementRef;
  public language_selected = '';
	public default_language_data: any = [];
  public resultData:any;

  public gooeleMap: any;
  public latitude:any='';
  public longitude:any='';
  public latitudeCenter:any='';
  public longitudeCenter:any='';
  public address:any='';

  public passwordType: string = 'password';
  public passwordIcon: string = 'eye-off';
  public accept_tems:boolean=false;

  public locationCordinates: any;
  public timestamp: any;

  public registerForm = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    phone_number: ['', Validators.required],
    four_digit_pin: ['', Validators.required],
    latitude: [''],
    longitude: ['']
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
    'four_digit_pin': [
      { type: 'required', message: '4 Digit pin is required.' }
    ]
  };

  constructor(public client: ClientService, public fb: FormBuilder, public loadingCtrl: LoadingController, private inAppBrowser: InAppBrowser, private geolocation: Geolocation, private platform: Platform, private nativeGeocoder: NativeGeocoder, private androidPermissions: AndroidPermissions, private locationAccuracy: LocationAccuracy)
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
  }

  async ionViewWillEnter()
  {
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
    await this.geolocation.getCurrentPosition().then(async (response) => 
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

  JustAssignLatLonAsGlobal()
  {
    console.log(this.latitude);
    console.log(this.longitude);
    this.registerForm.controls['latitude'].setValue(this.latitude);
    this.registerForm.controls['longitude'].setValue(this.longitude);
    this.getAddressFromLatitudeAndLongitude(this.latitude, this.longitude);//THIS WILL GET ADDRESS ON BASES OF LATITUDE AND LONGITUDE
  }
}
