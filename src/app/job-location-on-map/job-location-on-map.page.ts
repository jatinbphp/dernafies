import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ClientService } from '../providers/client.service';
import { Platform, LoadingController, ModalController, NavParams } from '@ionic/angular';

declare var google;

@Component({
  selector: 'app-job-location-on-map',
  templateUrl: './job-location-on-map.page.html',
  styleUrls: ['./job-location-on-map.page.scss'],
})

export class JobLocationOnMapPage implements OnInit 
{
  @ViewChild('gooeleMap')  mapElement: ElementRef;
  public rtl_or_ltr = '';
  public language_selected = '';
	public default_language_data: any = [];

  public job_id:any='';
  public handyman_id:any='';
  public job_latitude:any='';
  public job_longitude:any='';
  public handyman_latitude:any='';
  public handyman_longitude:any='';
  public latitudeCenter:any='';
  public longitudeCenter:any='';

  public id:any='';
  public role:any='';
  public resultData:any = [];

  public gooeleMap: any;
  public directionsService = new google.maps.DirectionsService;
  public directionsDisplay = new google.maps.DirectionsRenderer;
  constructor(public client: ClientService, public modalCtrl: ModalController, public navParams: NavParams, public loadingCtrl: LoadingController, private platform: Platform)
  { 
    this.client.getObservableOnLanguageChange().subscribe((data) => {
			this.language_selected = data.language_selected;
			this.rtl_or_ltr = (this.language_selected == 'arabic') ? 'rtl' : 'ltr';
			console.log('Data received', data);
		});//THIS OBSERVABLE IS USED TO SET DEFAULT OR SELECTED LANGUAGE
		this.rtl_or_ltr = (this.language_selected == 'arabic') ? 'rtl' : 'ltr';
  }

  ngOnInit()
  { 
    this.id = localStorage.getItem('id');
    this.role = localStorage.getItem('role');
  }

  async ionViewWillEnter()
  {
    this.default_language_data = this.client.default_language_data;
		this.language_selected = this.client.language_selected;

    this.job_id = this.navParams.get('job_id');
    this.handyman_id = this.navParams.get('handyman_id');
    this.job_latitude = Number(this.navParams.get('job_latitude'));
    this.job_longitude = Number(this.navParams.get('job_longitude'));
    
    if(this.role == 'handyman')
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

      let data = {
				id:this.id
			}
			await this.client.getHandymanDetailById(data).then(result => 
			{	
				loading.dismiss();//DISMISS LOADER			
				this.resultData=result;
        this.handyman_latitude = Number(this.resultData['latitude']);
        this.handyman_longitude = Number(this.resultData['longitude']);
        console.log(this.resultData);
      },
			error => 
			{
				loading.dismiss();//DISMISS LOADER
				console.log();
			});
    }

    this.platform.ready().then(async () => 
    {
      let latLng = new google.maps.LatLng(this.job_latitude, this.job_longitude);
      let mapOptions = 
      {
        center: latLng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        travelMode: google.maps.TravelMode.DRIVING,
        draggable: true,//THIS WILL NOW ALLOW MAP TO DRAG
        disableDefaultUI: true,//THIS WILL REMOVE THE ZOOM OPTION +/-
      } 
      this.gooeleMap = new google.maps.Map(this.mapElement.nativeElement, mapOptions);//THIS WILL DRAW DIRECTION LINE
      this.directionsDisplay.setMap(this.gooeleMap);

      this.gooeleMap.addListener('tilesloaded', () => 
      {
        this.latitudeCenter = this.gooeleMap.center.lat();
        this.longitudeCenter = this.gooeleMap.center.lng();
      });

      const myLatLngJobLocation = { lat: this.job_latitude, lng: this.job_longitude };
      let imageJobLocation = 
      {
        url: './assets/images/marker-home1.png', // image is 512 x 512
        scaledSize: new google.maps.Size(60, 60),
      };
      
      let markerToReturnJobLocation = new google.maps.Marker({
        draggable: false,
        position: myLatLngJobLocation,
        map: this.gooeleMap,
        animation: 'DROP',
        title: '',
        icon: imageJobLocation
      });
      
      const myLatLngHandyManLocation = { lat: this.handyman_latitude, lng: this.handyman_longitude };
      let imageHandyManLocation = 
      {
        url: './assets/images/marker-home1.png', // image is 512 x 512
        scaledSize: new google.maps.Size(60, 60),
      };
      
      let markerToReturnHandyManLocation = new google.maps.Marker({
        draggable: false,
        position: myLatLngHandyManLocation,
        map: this.gooeleMap,
        animation: 'DROP',
        title: '',
        icon: imageHandyManLocation
      });

      this.calculateAndDisplayRoute(myLatLngJobLocation,myLatLngHandyManLocation)
    });
  }

  calculateAndDisplayRoute(myLatLngJobLocation,myLatLngHandyManLocation)
  {
    const that = this;
    this.directionsService.route({origin: myLatLngJobLocation,destination: myLatLngHandyManLocation,travelMode: 'DRIVING'},(response, status) => 
    {
      if (status === 'OK') 
      {
        that.directionsDisplay.setDirections(response);
        console.log(that.directionsDisplay);
      } 
      else 
      {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  dismissModal()
	{
		this.modalCtrl.dismiss({
			'dismissed': true
		});
  }
}
