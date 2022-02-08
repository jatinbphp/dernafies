import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ClientService } from '../providers/client.service';
import { NavigationExtras } from '@angular/router';
import { ProfilePage } from '../profile/profile.page';

@Component({
  selector: 'app-view-a-jobs',
  templateUrl: './view-a-jobs.page.html',
  styleUrls: ['./view-a-jobs.page.scss'],
})

export class ViewAJobsPage implements OnInit 
{
  public rtl_or_ltr = '';
  public language_selected = '';
	public default_language_data: any = [];
  public language_key_exchange_array: any = [];
  public province_language_key_exchange_array: any = [];

  public id:any = '';
  public role:any = '';
  public user_type:any = '';
  public requestedjobRequestsHandyMan: any=[];

  constructor(public client: ClientService, public loadingCtrl: LoadingController, public alertController: AlertController, public modalCtrl: ModalController)
  { 
    this.default_language_data = this.client.default_language_data;
		this.language_selected = this.client.language_selected;
  }

  ngOnInit()
  { 
    this.language_key_exchange_array['english']='categoryName';
    this.language_key_exchange_array['arabic']='categoryNameArabic';
    this.language_key_exchange_array['kurdish']='categoryNameKurdi';

    this.province_language_key_exchange_array['english']='provinceName';
    this.province_language_key_exchange_array['arabic']='provinceNameArabic';
    this.province_language_key_exchange_array['kurdish']='provinceNameKurdi';
  }

  async ionViewWillEnter()
  {
    this.default_language_data = this.client.default_language_data;
		this.language_selected = this.client.language_selected;
    this.id=localStorage.getItem('id');
    this.role = localStorage.getItem('role');
    this.user_type = (this.role == 'handyman') ? 2 : 3;

    //LOADER
    const loadingHandyManRequests = await this.loadingCtrl.create({
      spinner: null,
      //duration: 5000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loadingHandyManRequests.present();
    //LOADER
    let dataHandyManNewJobRequest = {
      user_id:this.id,        
      user_type:this.user_type
    }
    await this.client.getRequestedJobsOffers(dataHandyManNewJobRequest).then(result => 
    {	
      loadingHandyManRequests.dismiss();//DISMISS LOADER
      this.requestedjobRequestsHandyMan=result['requested'];
      console.log("ALL",this.requestedjobRequestsHandyMan);
    },
    error => 
    {
      loadingHandyManRequests.dismiss();//DISMISS LOADER
      console.log();
    });//JOB REQUESTED
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
