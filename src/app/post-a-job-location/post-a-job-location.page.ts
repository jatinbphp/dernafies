import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Platform, LoadingController } from '@ionic/angular';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { ClientService } from '../providers/client.service';

declare var google;

@Component({
  selector: 'app-post-a-job-location',
  templateUrl: './post-a-job-location.page.html',
  styleUrls: ['./post-a-job-location.page.scss'],
})

export class PostAJobLocationPage implements OnInit 
{
  @ViewChild('gooeleMap')  mapElement: ElementRef;
  public handyman_category_id:any='';
  public handyman_category_name:any='';
  public handyman_category_image:any='';
  public to_be_show_featured_handyman:any='';


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
  constructor(private client: ClientService, private loadingCtrl: LoadingController, private platform: Platform, private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder, private route: ActivatedRoute)
  { }

  ngOnInit()
  { 
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
    this.handyman_category_id=this.queryStringData['handyman_category_id'];
    this.handyman_category_name=this.queryStringData['handyman_category_name'];
    this.handyman_category_image=this.queryStringData['handyman_category_image'];
    this.to_be_show_featured_handyman=this.queryStringData['to_be_show_featured_handyman'];

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
    let handyman_category_id = (this.handyman_category_id) ? this.handyman_category_id : 0;
    let user_id = (this.id) ? this.id : 0;

    let jobObject ={
      latitude:latitude,
      longitude:longitude,
      address:address,
      handyman_category_id:handyman_category_id,
      handyman_category_name:this.handyman_category_name,
      handyman_category_image:this.handyman_category_image,
      user_id:user_id
    }
    localStorage.setItem('post-a-job',JSON.stringify(jobObject));
    this.client.router.navigate(['/tabs/post-a-job-add']);
  }

  GoBack()
  {
    this.client.router.navigate(['/tabs/post-a-job']);
  }
}
