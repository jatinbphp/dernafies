import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ClientService } from '../providers/client.service';
import { NavigationExtras } from '@angular/router';
import { RescheduleJobPage } from '../reschedule-job/reschedule-job.page';
import { MessagesCustomerHandymanPage } from '../messages-customer-handyman/messages-customer-handyman.page';
import { JobDescriptionPage } from '../job-description/job-description.page';

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
  public resultJobUpdatedStatus: any = [];
  public resultJobReviewAndRatingRequest: any = [];
  public queryString: any=[];
  public CurrentRequestList:string='AcceptRequest';
  
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
    //this.showHomeContent();
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
  
  async showHomeContent()
  {
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

  async confirmUpdateJobStatus(job_id,status_to_update)
  {
    let status = (status_to_update == 3) ? "Completed" : "";
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Dernafies',
      message: 'Please confirm:<br />\nAre you sure to mark <strong>'+status+'</strong> for the service request?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => 
          {
            console.log('Confirm Cancel: blah');
          }
        }, 
        {
          text: 'Okay',
          handler: () => 
          {
            this.UpdateJobStatus(job_id,status_to_update);
            console.log('Confirm Okay');
          }
        }
      ]
    });
    await alert.present();
  }

  async UpdateJobStatus(job_id,status_to_update)
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
    let dataJobStatus = {
      job_id:job_id,        
      status_to_update:status_to_update
    }
    await this.client.UpdateJobStatus(dataJobStatus).then(result => 
    {	
      loading.dismiss();//DISMISS LOADER			
      this.resultJobUpdatedStatus=result; 
      this.client.showMessage(this.resultJobUpdatedStatus['message']);
      this.ionViewWillEnter();
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });//JOB REQUESTS FOR HANDYMAN    
  }

  addReviewAndRating(job_id,handyman_category_nm,handyman_id)
  {
    
    this.queryString = 
    {
      job_id:job_id,
      handyman_category_nm:handyman_category_nm,
      handyman_id:handyman_id
    };

    let navigationExtras: NavigationExtras = 
    {
      queryParams: 
      {
        special: JSON.stringify(this.queryString)
      }
    };
    this.client.router.navigate(['/tabs/review-and-rating'], navigationExtras);
  }

  segmentSelected(ev)
  {
    this.CurrentRequestList=ev.detail.value;
    console.log(this.CurrentRequestList);
  }

  async requestCustomerForReview(job_id)
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
    let dataJobForReviewAndRating = {
      job_id:job_id
    }
    await this.client.reviewEmailNotification(dataJobForReviewAndRating).then(result => 
    {	
      loading.dismiss();//DISMISS LOADER			
      this.resultJobReviewAndRatingRequest=result; 
      this.client.showMessage(this.resultJobReviewAndRatingRequest['message']);
      this.ionViewWillEnter();
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });
  }

  async completeTheJob(job_id)
  {
    this.queryString = 
    {
      job_id:job_id,
    };

    let navigationExtras: NavigationExtras = 
    {
      queryParams: 
      {
        special: JSON.stringify(this.queryString)
      }
    };
    this.client.router.navigate(['/tabs/complete-the-job'], navigationExtras);
  }

  async JobResechedule(job_id)
  {
    const modal = await this.modalCtrl.create({
      component: RescheduleJobPage,
      componentProps: {
        'job_id': job_id
      }
    });

    return await modal.present();
  }

  async messageBetweenCustomerAndHandyman(job_id,user_id,handyman_id,firebase_message_id_for_job)
  {
    const modal = await this.modalCtrl.create({
      component: MessagesCustomerHandymanPage,
      componentProps: {
        'job_id': job_id,
        'user_id': user_id,
        'handyman_id': handyman_id,
        'firebase_message_id_for_job': firebase_message_id_for_job
      }
    });

    return await modal.present();
  }

  doRefresh(ev)
  {
    setTimeout(() => 
    {
        this.showHomeContent();
        ev.target.complete();
    }, 2000);
  }

  async ViewJobDetail(job_id)
  {
    const modal = await this.modalCtrl.create({
      component: JobDescriptionPage,
      componentProps: {
        'job_id': job_id
      }
    });

    return await modal.present();
  }
}
