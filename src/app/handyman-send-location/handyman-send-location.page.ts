import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';

declare var google;

@Component({
  selector: 'app-handyman-send-location',
  templateUrl: './handyman-send-location.page.html',
  styleUrls: ['./handyman-send-location.page.scss'],
})

export class HandymanSendLocationPage implements OnInit 
{
  @ViewChild('gooeleMap')  mapElement: ElementRef;
  public latitude:any='';
  public longitude:any='';
  public gooeleMap: any;
  public latitudeCenter:any='';
  public longitudeCenter:any='';
  constructor(private platform: Platform, private geolocation: Geolocation)
  { }

  ngOnInit()
  { 
    this.platform.ready().then(async () => 
    {
      const coordinates = await this.geolocation.getCurrentPosition();
      this.latitude=Number(coordinates.coords.latitude);
      this.longitude=Number(coordinates.coords.longitude);

      let latLng = new google.maps.LatLng(this.latitude, this.longitude);
      let mapOptions = 
      {
        center: latLng,
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        draggable: false,//THIS WILL NOW ALLOW MAP TO DRAG
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
        url: './assets/images/home-icon1.png', // image is 512 x 512
        scaledSize: new google.maps.Size(30, 30),
      };
      let markerToReturn = new google.maps.Marker({
        draggable: false,
        position: myLatLng,
        map: this.gooeleMap,
        title: '',
        icon: image
      });
    });
    console.log("LAT",this.latitude);
    console.log("LON",this.longitude);
  }

}
