import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ClientService } from '../providers/client.service';

@Component({
  selector: 'app-renew-subscription',
  templateUrl: './renew-subscription.page.html',
  styleUrls: ['./renew-subscription.page.scss'],
})

export class RenewSubscriptionPage implements OnInit 
{
  public language_selected = '';
	public default_language_data: any = [];
  public resultDataSubscriptionPlans: any = [];
  public resultDataSubscriptionPlansRenewal: any = [];
  public language_key_exchange_subscription_plan: any = [];
  public queryStringData: any=[];
  public handyman_id:any=0;

  public subscriptionPlanForm = this.fb.group({
    handyman_id: ['', Validators.required],
    subscription_plan: ['', Validators.required]
  });

  validation_messages = 
  {    
    'handyman_id': 
    [
      { type: 'required', message: 'Trademan ID is required.' }
    ],   
    'subscription_plan': 
    [
      { type: 'required', message: 'Selecting service plan is required.' }
    ]
  };

  constructor(public client: ClientService, public fb: FormBuilder, public loadingCtrl: LoadingController, private route: ActivatedRoute)
  { 
    this.default_language_data = this.client.default_language_data;
		this.language_selected = this.client.language_selected;
  }

  async ngOnInit()
  { 
    this.language_key_exchange_subscription_plan['english']='planName';
    this.language_key_exchange_subscription_plan['arabic']='planNameArabic';
    this.language_key_exchange_subscription_plan['kurdish']='planNameKurdish';

    //LOADER
		const loadingSubscriptionPlans = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loadingSubscriptionPlans.present();
		//LOADER
    await this.client.getSubscriptionPlan().then(resultSubscription => 
    {	
      loadingSubscriptionPlans.dismiss();//DISMISS LOADER			
      this.resultDataSubscriptionPlans=resultSubscription;
      console.log("Subscriptions",this.resultDataSubscriptionPlans);
    },
    error => 
    {
      loadingSubscriptionPlans.dismiss();//DISMISS LOADER
      console.log();
    });//Subscriptions plans
  }

  async ionViewWillEnter()
  {
    this.route.queryParams.subscribe(params => 
    {
      if(params && params.special)
      {
        this.queryStringData = JSON.parse(params.special);        
      }
    });
    this.handyman_id=this.queryStringData['trademanID'];
    this.subscriptionPlanForm.controls['handyman_id'].setValue(this.handyman_id);
  }

  async RenewMyPackage(form)
  {
    let handyman_id = (form.handyman_id) ? form.handyman_id : 0;
    let subscription_plan = (form.subscription_plan) ? form.subscription_plan : 0;

    //LOADER
		const loadingSubscriptionPlansRenewal = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loadingSubscriptionPlansRenewal.present();
		//LOADER
    let dataRenewal = {
      handyman_id:handyman_id,
      subscription_plan:subscription_plan
    }
    await this.client.renewalSubscriptionPlan(dataRenewal).then(resultRenewal => 
    {	
      loadingSubscriptionPlansRenewal.dismiss();//DISMISS LOADER			
      this.resultDataSubscriptionPlansRenewal=resultRenewal;
      if(this.resultDataSubscriptionPlansRenewal.status == true)
      {
        this.client.showMessage(this.resultDataSubscriptionPlansRenewal.message);
        this.client.router.navigate(['/sign-in']);
      }
    },
    error => 
    {
      loadingSubscriptionPlansRenewal.dismiss();//DISMISS LOADER
      console.log();
    });//Subscriptions Renewal
  }
}
