import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ClientService } from '../providers/client.service';
import { FirebaseClientService } from '../providers/firebase-client.service';
import { NavigationExtras } from '@angular/router';
import { ProfilePage } from '../profile/profile.page';
import { JobLocationOnMapPage } from '../job-location-on-map/job-location-on-map.page';

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

  public firebase_job_id:any='';
	public resultDataFireBase:any=[];

  public slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  public id:any = '';
  public role:any = '';
  public user_type:any = '';
  public requestedjobRequestsHandyMan: any=[];
  public AcceptedjobRequestsByHandyMan: any=[];
  public AcceptedjobRequestsByHandyManLength: number=0;
  public AcceptOrRejectedJobByHandyMan: any=[];

  constructor(public client: ClientService, private fireClient: FirebaseClientService, public loadingCtrl: LoadingController, public alertController: AlertController, public modalCtrl: ModalController)
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
    this.requestedjobRequestsHandyMan=[];
    if(this.role == "handyman")
    {
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
    if(this.role == "customer")
    {
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
      await this.client.getAllAcceptedJobsOffers(dataHandyManNewJobRequest).then(result => 
      {	
        loadingHandyManRequests.dismiss();//DISMISS LOADER
        this.requestedjobRequestsHandyMan=result;
        console.log("ALL",this.requestedjobRequestsHandyMan);
      },
      error => 
      {
        loadingHandyManRequests.dismiss();//DISMISS LOADER
        console.log();
      });//JOB ACCEPTED

      await this.extractResultOfAcceptedJobs();
    }
  }

  async extractResultOfAcceptedJobs()
  {
    //AcceptedjobRequestsByHandyMan
    this.AcceptedjobRequestsByHandyManLength=0;
    for(const [key, value] of Object.entries(this.requestedjobRequestsHandyMan))
    {
      let objAcceptedJob = {
        job_key:key,
        job_value:value
      }
      this.AcceptedjobRequestsByHandyMan[key]=value;
      (this.AcceptedjobRequestsByHandyMan[key]!='' && this.AcceptedjobRequestsByHandyMan[key]!=null && this.AcceptedjobRequestsByHandyMan[key]!=undefined)
      {
        this.AcceptedjobRequestsByHandyManLength++;
      }
    }
    console.log(this.AcceptedjobRequestsByHandyMan);
    console.log(this.AcceptedjobRequestsByHandyMan.length);
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

  async showMapWithLocations(job_id,handyman_id,job_latitude,job_longitude)
  {
    const modal = await this.modalCtrl.create({
      component: JobLocationOnMapPage,
      componentProps: 
			{ 
				job_id: job_id,
				handyman_id: handyman_id,
				job_latitude: job_latitude,
				job_longitude: job_longitude
			}
    });

    return await modal.present();
  }

  async AcceptOrRejectPostAJobByHandyMan(handyman_id,unique_code,status_selected)
  {
    //LOADER
    const loadingHandyJobUpdateStatus = await this.loadingCtrl.create({
      spinner: null,
      //duration: 5000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loadingHandyJobUpdateStatus.present();
    //LOADER
    let dataHandyManNewJobRequest = {
      handyman_id:handyman_id,        
      unique_code:unique_code,
      status_selected:status_selected
    }
    await this.client.requestJobOffeResponce(dataHandyManNewJobRequest).then(result => 
    {	
      loadingHandyJobUpdateStatus.dismiss();//DISMISS LOADER
      this.AcceptOrRejectedJobByHandyMan=result;
      if(this.AcceptOrRejectedJobByHandyMan.status == true)
      {
        this.client.showMessage(this.AcceptOrRejectedJobByHandyMan.message);
        this.ionViewWillEnter();
      }
    },
    error => 
    {
      loadingHandyJobUpdateStatus.dismiss();//DISMISS LOADER
      console.log();
    });
  }

  async AcceptOrRejectPostAJobByCustomer(handyman_id,unique_code,status_selected)
  {
    //LOADER
    const loadingHandyJobUpdateStatus = await this.loadingCtrl.create({
      spinner: null,
      //duration: 5000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loadingHandyJobUpdateStatus.present();
    //LOADER
    let dataHandyManNewJobRequest = {
      handyman_id:handyman_id,        
      unique_code:unique_code,
      status_selected:status_selected
    }
    await this.client.acceptedJobOffeByCustomer(dataHandyManNewJobRequest).then(result => 
    {	
      loadingHandyJobUpdateStatus.dismiss();//DISMISS LOADER
      this.AcceptOrRejectedJobByHandyMan=result;
      if(this.AcceptOrRejectedJobByHandyMan.status == true)
      {
        this.client.showMessage(this.AcceptOrRejectedJobByHandyMan.message);
      }
    },
    error => 
    {
      loadingHandyJobUpdateStatus.dismiss();//DISMISS LOADER
      console.log();
    });

    //ADD JOB TO FIREBASE, SO MESSAGING BETWEEN CUSTOMER AND HANDYMAN CAN BE INITITATE
		//LOADER
    const loading = await this.loadingCtrl.create({
      spinner: null,
      //duration: 5000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loadingHandyJobUpdateStatus.present();
    //LOADER
    let dataMessage = {
			job_id:this.AcceptOrRejectedJobByHandyMan.data.id
		}
		await this.fireClient.addMessageEntryToFirebase(dataMessage).then(result => 
		{	      
			this.resultDataFireBase=result;
			this.firebase_job_id = this.resultDataFireBase['id'];
			//console.log(this.firebase_job_id);
		},
		error => 
		{
			loading.dismiss();//DISMISS LOADER
			console.log(error);
		});
		//ADD JOB TO FIREBASE, SO MESSAGING BETWEEN CUSTOMER AND HANDYMAN CAN BE INITITATE

		//UPDATE FIREBASE AUTOINC ID TO JOB TABLE
		let dataMessageID = {
			job_id:this.AcceptOrRejectedJobByHandyMan.data.id,
			firebase_id:this.firebase_job_id
		}
		await this.client.updateFirebaseMessageId(dataMessageID).then(result => 
		{	      
			loading.dismiss();//DISMISS LOADER
			console.log(result);
			this.client.router.navigate(['/tabs/current-requests']);
		},
		error => 
		{
			loading.dismiss();//DISMISS LOADER
			console.log(error);
		});
		//UPDATE FIREBASE AUTOINC ID TO JOB TABLE
  }
}
