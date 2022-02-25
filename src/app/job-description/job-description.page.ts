import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, NavParams } from '@ionic/angular';
import { ClientService } from '../providers/client.service';

@Component({
  selector: 'app-job-description',
  templateUrl: './job-description.page.html',
  styleUrls: ['./job-description.page.scss'],
})

export class JobDescriptionPage implements OnInit 
{
  public language_selected = '';
	public default_language_data: any = [];
  public language_key_exchange_array: any = [];
  
  public user_id:any='';
  public role:any='';
  public job_id:any='';
  public resultData:any = [];
  public resultDataHandyMan:any = [];
  public resultDataCustomer:any = [];

  constructor(public client: ClientService, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public navParams: NavParams)
  { 
    this.default_language_data = this.client.default_language_data;
		this.language_selected = this.client.language_selected;
		console.log("DATA",this.default_language_data);
		console.log("LANG",this.language_selected);
  }

  ngOnInit()
  { 
    this.language_key_exchange_array['english']='categoryName';
		this.language_key_exchange_array['arabic']='categoryNameArabic';
		this.language_key_exchange_array['kurdish']='categoryNameKurdi';
  }

  async ionViewWillEnter()
	{
    this.user_id=localStorage.getItem('id');
    this.role=localStorage.getItem('role');
    this.job_id = this.navParams.get('job_id');
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
      job_id:this.job_id
    }
    await this.client.getJobDetailByID(data).then(result => 
    {	
      loading.dismiss();//DISMISS LOADER			
      this.resultData=result; 
      this.resultDataHandyMan=this.resultData['handyman'];
      this.resultDataCustomer=this.resultData['customer'];
      console.log(this.resultData);
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });
  }

  dismissModal()
	{
		this.modalCtrl.dismiss({
			'dismissed': true
		});
  }
}
