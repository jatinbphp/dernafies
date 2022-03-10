import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Platform, LoadingController } from '@ionic/angular';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { ClientService } from '../providers/client.service';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

declare var google;

@Component({
  selector: 'app-handyman-send-location',
  templateUrl: './handyman-send-location.page.html',
  styleUrls: ['./handyman-send-location.page.scss'],
})

export class HandymanSendLocationPage implements OnInit 
{
  @ViewChild('gooeleMap')  mapElement: ElementRef;
  public rtl_or_ltr = '';
  public language_selected = '';
	public default_language_data: any = [];

  public handyman_id:any='';
  public handyman_category_id:any='';

  public queryString: any=[];
  public resultData:any = [];
  public id:any='';
  public latitude:any='';
  public longitude:any='';
  public latitude_for_geocoder:any='';
  public longitude_for_geocoder:any='';
  public address:any='';
  public gooeleMap: any;
  public latitudeCenter:any='';
  public longitudeCenter:any='';
  public queryStringData: any=[];
  
  public locationCordinates: any;
  public timestamp: any;
  constructor(private client: ClientService, private loadingCtrl: LoadingController, private platform: Platform, private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder, private route: ActivatedRoute, private androidPermissions: AndroidPermissions, private locationAccuracy: LocationAccuracy)
  { 
    this.client.getObservableOnLanguageChange().subscribe((data) => {
			this.language_selected = data.language_selected;
			this.rtl_or_ltr = (this.language_selected == 'arabic') ? 'rtl' : 'ltr';
			console.log('Data received', data);
		});//THIS OBSERVABLE IS USED TO SET DEFAULT OR SELECTED LANGUAGE
  }

  async ngOnInit()
  { 
    this.default_language_data = this.client.default_language_data;
		this.language_selected = this.client.language_selected;
		this.rtl_or_ltr = (this.language_selected == 'arabic') ? 'rtl' : 'ltr';
    /*
    this.platform.ready().then(async () => 
    {
      const coordinates = await this.geolocation.getCurrentPosition();
      this.latitude=Number(coordinates.coords.latitude);
      this.longitude=Number(coordinates.coords.longitude);
      //console.log(this.latitude,this.longitude);
      this.latitude_for_geocoder = String(this.latitude);
      this.longitude_for_geocoder = String(this.longitude);

      let latLng = new google.maps.LatLng(this.latitude, this.longitude);
      let mapOptions = 
      {
        center: latLng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        draggable: true,//THIS WILL NOW ALLOW MAP TO DRAG
        disableDefaultUI: true,//THIS WILL REMOVE THE ZOOM OPTION +/-
      } 

      //LOAD THE MAP WITH THE PREVIOUS VALUES AS PARAMETERS.
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
        animation: 'DROP',
        title: '',
        icon: image
      });

      //THIS PORTION ALLOW TO DRAG MARKER AND GET THE POSITION
      let classObj = this;//This is the class object we can say "HandymanSendLocationPage"
      await google.maps.event.addListener(markerToReturn, 'dragend', function(this)//here "this" means "HandymanSendLocationPage"
      {
        this.markerlatlong = markerToReturn.getPosition();        
        classObj.latitude=markerToReturn.getPosition().lat();
        classObj.longitude=markerToReturn.getPosition().lng();
        classObj.getAddressFromLatitudeAndLongitude(classObj.latitude, classObj.longitude);//THIS WILL GET ADDRESS ON BASES OF LATITUDE AND LONGITUDE
        //console.log("latlong"+this.markerlatlong);
        //console.log("lat"+markerToReturn.getPosition().lat());
        //console.log("long"+markerToReturn.getPosition().lng());
      });//THIS PORTION ALLOW TO DRAG MARKER AND GET THE POSITION

      this.getAddressFromLatitudeAndLongitude(this.latitude_for_geocoder, this.longitude_for_geocoder);//THIS WILL GET ADDRESS ON BASES OF LATITUDE AND LONGITUDE
    });
    console.log("LAT",this.latitude);
    console.log("LON",this.longitude);
    */
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

  async ionViewWillEnter()
  {
    this.id = localStorage.getItem('id');    
    this.route.queryParams.subscribe(params => 
    {
      if(params && params.special)
      {
        this.queryStringData = JSON.parse(params.special);        
      }
    });
    this.handyman_id=this.queryStringData['handyman_id'];
    this.handyman_category_id=this.queryStringData['handyman_category_id'];

    //USER INFORMATION
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
    },
		error => 
		{
			loading.dismiss();//DISMISS LOADER
			console.log();
		});
    //USER INFORMATION
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

  SendLocationPin()
  {
    let latitude = (this.latitude) ? this.latitude : "";
    let longitude = (this.longitude) ? this.longitude : "";
    let address = (this.address) ? this.address : "";
    let handyman_id = (this.handyman_id) ? this.handyman_id : 0;
    let handyman_category_id = (this.handyman_category_id) ? this.handyman_category_id : 0;
    let user_id = (this.id) ? this.id : 0;

    let jobObject ={
      latitude:latitude,
      longitude:longitude,
      address:address,
      handyman_id:handyman_id,
      handyman_category_id:handyman_category_id,
      user_id:user_id
    }
    localStorage.setItem('job',JSON.stringify(jobObject));
    this.client.router.navigate(['/tabs/add-job']);
  }

  GoBack()
  {
    let way_to_select_handyman = JSON.parse(localStorage.getItem('way_to_select_handyman'));
    this.queryString = 
    {
      handyman_category_id:way_to_select_handyman.handyman_category_id,
      id:way_to_select_handyman.handyman_id
    };
    let navigationExtras: NavigationExtras = 
    {
      queryParams: 
      {
        special: JSON.stringify(this.queryString)
      }
    };
    this.client.router.navigate(['/tabs/handyman-selected'], navigationExtras);
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

    this.latitude_for_geocoder = String(this.latitude);
    this.longitude_for_geocoder = String(this.longitude);

    let latLng = new google.maps.LatLng(this.latitude, this.longitude);
    let mapOptions = 
    {
      center: latLng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      draggable: true,//THIS WILL NOW ALLOW MAP TO DRAG
      disableDefaultUI: true,//THIS WILL REMOVE THE ZOOM OPTION +/-
    } 

    //LOAD THE MAP WITH THE PREVIOUS VALUES AS PARAMETERS.
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
      animation: 'DROP',
      title: '',
      icon: image
    });

    //THIS PORTION ALLOW TO DRAG MARKER AND GET THE POSITION
    let classObj = this;//This is the class object we can say "HandymanSendLocationPage"
    await google.maps.event.addListener(markerToReturn, 'dragend', function(this)//here "this" means "HandymanSendLocationPage"
    {
      this.markerlatlong = markerToReturn.getPosition();        
      classObj.latitude=markerToReturn.getPosition().lat();
      classObj.longitude=markerToReturn.getPosition().lng();
      classObj.getAddressFromLatitudeAndLongitude(classObj.latitude, classObj.longitude);//THIS WILL GET ADDRESS ON BASES OF LATITUDE AND LONGITUDE
      //console.log("latlong"+this.markerlatlong);
      //console.log("lat"+markerToReturn.getPosition().lat());
      //console.log("long"+markerToReturn.getPosition().lng());
    });//THIS PORTION ALLOW TO DRAG MARKER AND GET THE POSITION

    this.getAddressFromLatitudeAndLongitude(this.latitude_for_geocoder, this.longitude_for_geocoder);//THIS WILL GET ADDRESS ON BASES OF LATITUDE AND LONGITUDE
  }
}
