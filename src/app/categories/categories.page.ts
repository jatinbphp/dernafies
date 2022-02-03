import { Component } from '@angular/core';
import { Platform, LoadingController, ModalController } from '@ionic/angular';
import { ClientService } from '../providers/client.service';
import { NavigationExtras } from '@angular/router';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { ProfilePage } from '../profile/profile.page';

@Component({
  selector: 'app-categories',
  templateUrl: 'categories.page.html',
  styleUrls: ['categories.page.scss']
})

export class CategoriesPage 
{
  public rtl_or_ltr = '';
  public language_selected = '';
	public default_language_data: any = [];
  public current_latitude:any = '';
  public current_longitude:any = '';

  public resultDataCategories: any = [];
  public language_key_exchange_array: any = [];
  public queryString: any=[];
  constructor(public client: ClientService, public modalCtrl: ModalController, public loadingCtrl: LoadingController, private geolocation: Geolocation, private platform: Platform, private nativeGeocoder: NativeGeocoder) 
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
    
    this.language_key_exchange_array['english']='categoryName';
    this.language_key_exchange_array['arabic']='categoryNameArabic';
    this.language_key_exchange_array['kurdish']='categoryNameKurdi';

    this.platform.ready().then(async () => 
    {
      const coordinates = await this.geolocation.getCurrentPosition();
      this.current_latitude=Number(coordinates.coords.latitude);
      this.current_longitude=Number(coordinates.coords.longitude);
    });
    
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
    await this.client.getCategories().then(result => 
    {	
      loading.dismiss();//DISMISS LOADER			
      this.resultDataCategories=result;
      console.log(this.resultDataCategories);
            
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });//CATEGORIES
  }

  showHandyManByCategory(id)
  {
    this.queryString = 
    {
      handyman_category_id:id,
      latitude:this.current_latitude,
      longitude:this.current_longitude,
      to_be_show_featured_handyman:"no"
    };
    localStorage.setItem("way_to_select_handyman",JSON.stringify(this.queryString));
    let navigationExtras: NavigationExtras = 
    {
      queryParams: 
      {
        special: JSON.stringify(this.queryString)
      }
    };
    this.client.router.navigate(['/tabs/handyman-view-all'], navigationExtras);
    /*
    this.client.router.navigate(['/tabs/handyman-view-all'], navigationExtras).then(()=>{
      window.location.reload();
    });
    */
  }
  
  async showMyProfile()
  {
    let id = (localStorage.getItem('id')) ? localStorage.getItem('id') : undefined;
    if(id!='' && id!='null' && id!=null && id!=undefined && id!='undefined')
    {
      const modal = await this.modalCtrl.create({
        component: ProfilePage,
      });

      return await modal.present();
    }
    else 
    {
      this.client.router.navigate(['sign-in']);  
    }
  }
}
