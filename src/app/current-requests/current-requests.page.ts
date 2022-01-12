import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ClientService } from '../providers/client.service';

@Component({
  selector: 'app-current-requests',
  templateUrl: './current-requests.page.html',
  styleUrls: ['./current-requests.page.scss'],
})

export class CurrentRequestsPage implements OnInit 
{
  public rtl_or_ltr = '';
  public language_selected = '';
	public default_language_data: any = [];
  public language_key_exchange_array: any = [];

  public id:any = '';
  public role:any = '';
  public user_type:any = '';
  public requestedjobRequestsHandyMan: any=[];
  public acceptedjobRequestsHandyMan: any=[];
  public completedJobRequestsHandyMan: any=[];
  public CurrentRequestList:string='AcceptRequest';
  
  constructor(public client: ClientService, public loadingCtrl: LoadingController)
  { 
    this.default_language_data = this.client.default_language_data;
		this.language_selected = this.client.language_selected;
  }

  ngOnInit() 
  { 
    this.language_key_exchange_array['english']='categoryName';
    this.language_key_exchange_array['arabic']='categoryNameArabic';
    this.language_key_exchange_array['kurdish']='categoryNameKurdi';
  }

  async ionViewWillEnter()
  {
    this.default_language_data = this.client.default_language_data;
		this.language_selected = this.client.language_selected;
    this.id=localStorage.getItem('id');
    this.role = localStorage.getItem('role');
    this.user_type = (this.role == 'handyman') ? 2 : 3;

    //LOADER
    const loadingHandyManAcceptedRequests = await this.loadingCtrl.create({
      spinner: null,
      //duration: 5000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loadingHandyManAcceptedRequests.present();
    //LOADER
    let dataHandyManNewJobRequest = {
      user_id:this.id,        
      user_type:this.user_type
    }
    await this.client.getJobRequestsForHandyMan(dataHandyManNewJobRequest).then(result => 
    {	
      console.log("ALL",result);
      loadingHandyManAcceptedRequests.dismiss();//DISMISS LOADER			
      this.requestedjobRequestsHandyMan=result['requested']; 
      this.acceptedjobRequestsHandyMan=result['accepted']; 
      this.completedJobRequestsHandyMan=result['completed'];
      console.log("REQUESTED",this.requestedjobRequestsHandyMan);
      console.log("ACCEPTED",this.acceptedjobRequestsHandyMan);
      console.log("COMPLETED",this.completedJobRequestsHandyMan);
            
    },
    error => 
    {
      loadingHandyManAcceptedRequests.dismiss();//DISMISS LOADER
      console.log();
    });//JOB REQUESTED,ACCEPTED,COMPLETED
  }

}
