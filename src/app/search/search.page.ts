import { Component } from '@angular/core';
import { MenuController, LoadingController, ModalController } from '@ionic/angular';
import { ClientService } from '../providers/client.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfilePage } from '../profile/profile.page';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss']
})
export class SearchPage 
{
  public rtl_or_ltr = '';
  public language_selected = '';
	public default_language_data: any = [];

  public language_key_exchange_array: any = [];
  public search_for_handyman: any = [];
  public resultDataSearch: any = [];

  constructor(public fb: FormBuilder, public client: ClientService, public menu: MenuController, public loadingCtrl: LoadingController, public modalCtrl: ModalController) 
  {
    this.default_language_data = this.client.default_language_data;
		this.language_selected = this.client.language_selected;
  }

  async ngOnInit() 
  {
    this.language_key_exchange_array['english']='categoryName';
    this.language_key_exchange_array['arabic']='categoryNameArabic';
    this.language_key_exchange_array['kurdish']='categoryNameKurdi';
  }

  async ionViewWillEnter()
  {
    this.search_for_handyman=JSON.parse(localStorage.getItem('search_for_handyman'));
    //if(this.search_for_handyman.length > 0)
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
      let objSearch = {
        keyword:this.search_for_handyman.keyword,
        latitude:this.search_for_handyman.latitude,
        longitude:this.search_for_handyman.longitude,
        category_id:this.search_for_handyman.category_id,
        experience:this.search_for_handyman.experience,
        price_range:this.search_for_handyman.price_range,
        reviews:this.search_for_handyman.reviews,  
      }
      await this.client.searchHandyman(objSearch).then(result => 
      {	
        loading.dismiss();//DISMISS LOADER			
        this.resultDataSearch=result;
        console.log(this.resultDataSearch);
      },
      error => 
      {
        loading.dismiss();//DISMISS LOADER
        console.log();
      });//CATEGORIES
    }
    console.log(this.search_for_handyman);
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
