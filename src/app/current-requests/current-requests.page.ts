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
  public jobRequestsHandyMan: any=[];
  public completedJobRequestsHandyMan: any=[];
  public CurrentRequestList:string='AcceptRequest';
  
  constructor(public client: ClientService, public loadingCtrl: LoadingController)
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
    await this.client.getJobRequestsForHandyMan(dataHandyManNewJobRequest).then(result => 
    {	
      loadingHandyManRequests.dismiss();//DISMISS LOADER			
      this.jobRequestsHandyMan=result['requested']; 
      console.log("JOBS",this.jobRequestsHandyMan);
            
    },
    error => 
    {
      loadingHandyManRequests.dismiss();//DISMISS LOADER
      console.log();
    });//JOB REQUESTS FOR HANDYMAN
    
    //LOADER
    const loadingHandyManCompletedJobRequests = await this.loadingCtrl.create({
      spinner: null,
      //duration: 5000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loadingHandyManCompletedJobRequests.present();
    //LOADER
    let dataHandyManJobRequest = {
      user_id:this.id,        
      user_type:this.user_type
    }
    await this.client.getJobRequestsForHandyMan(dataHandyManJobRequest).then(result => 
    {	
      loadingHandyManCompletedJobRequests.dismiss();//DISMISS LOADER			
      this.completedJobRequestsHandyMan=result['completed']; 
      console.log("COMPLETED JOBS",this.completedJobRequestsHandyMan);
            
    },
    error => 
    {
      loadingHandyManCompletedJobRequests.dismiss();//DISMISS LOADER
      console.log();
    });//COMPLETED JOB REQUESTS FOR HANDYMAN
  }

}
