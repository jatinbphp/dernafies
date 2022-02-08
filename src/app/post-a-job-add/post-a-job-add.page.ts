import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ClientService } from '../providers/client.service';
import { LoadingController } from '@ionic/angular';
import { InAppBrowser, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-post-a-job-add',
  templateUrl: './post-a-job-add.page.html',
  styleUrls: ['./post-a-job-add.page.scss'],
})

export class PostAJobAddPage implements OnInit 
{

  	public language_selected = '';
	public default_language_data: any = [];
	public accept_tems:boolean=false;
	
	public queryString: any=[];
	public resultData:any=[];
	public resultDataJob:any=[];
  	public address:any='';
	public postAJobData: any=[];
	public handymanSelectedCategoryData: any=[];

	public BooKAJobForm = this.fb.group({
		handyman_category_id: ['', Validators.required],
		user_id: ['', Validators.required],
		job_description: ['', Validators.required],
		latitude: ['', Validators.required],
		longitude: ['', Validators.required],
		address:['', Validators.required]
	});

	validation_messages = 
	{		
		'handyman_category_id': 
		[
			{ type: 'required', message: 'Selecting category is required.' },
		],
		'job_description': 
		[
			{ type: 'required', message: 'Job description is required.' }
		]
	};
  
	constructor(public fb: FormBuilder, public client: ClientService, public loadingCtrl: LoadingController, private inAppBrowser: InAppBrowser)
	{ 
		this.default_language_data = this.client.default_language_data;
		this.language_selected = this.client.language_selected;
	}

  	ngOnInit()
	{ }

 	async ionViewWillEnter()
	{
		this.default_language_data = this.client.default_language_data;
		this.language_selected = this.client.language_selected;
		
		this.postAJobData = [];
		this.handymanSelectedCategoryData = [];
		let postAJobData = localStorage.getItem('post-a-job');
		this.postAJobData=JSON.parse(postAJobData);
		this.handymanSelectedCategoryData=JSON.parse(this.postAJobData['handyman_category_data']);		
    	this.resultDataJob = localStorage.getItem('post-a-job');
		this.resultDataJob = JSON.parse(this.resultDataJob);
		this.BooKAJobForm.controls['handyman_category_id'].setValue(this.resultDataJob.handyman_category_id);
    	this.BooKAJobForm.controls['user_id'].setValue(this.resultDataJob.user_id);
		this.BooKAJobForm.controls['latitude'].setValue(this.resultDataJob.latitude);
		this.BooKAJobForm.controls['longitude'].setValue(this.resultDataJob.longitude);
		this.BooKAJobForm.controls['address'].setValue(this.resultDataJob.address);
  	}

  	acceptTerms(ev)
	{
		let haveStatus = ev.detail.checked;
		if(haveStatus == true)
		{
			this.accept_tems = true;
		}
		else 
		{
			this.accept_tems = false;
		}
	}

	openActionRequested(targetUrl)
	{
		const options : InAppBrowserOptions = {
        location : 'yes',//Or 'no' 
        hidden : 'no', //Or  'yes'
        clearcache : 'yes',
        clearsessioncache : 'yes',
        zoom : 'yes',//Android only ,shows browser zoom controls 
        hardwareback : 'yes',
        mediaPlaybackRequiresUserAction : 'no',
        shouldPauseOnSuspend : 'no', //Android only 
        closebuttoncaption : 'Close', //iOS only
        disallowoverscroll : 'no', //iOS only 
        toolbar : 'yes', //iOS only 
        enableViewportScale : 'no', //iOS only 
        allowInlineMediaPlayback : 'no',//iOS only 
        presentationstyle : 'pagesheet',//iOS only 
        fullscreen : 'yes',//Windows only    
	    };
	    let target = "_system";
	    this.inAppBrowser.create(targetUrl,target,options);
	}

	GoBack()
	{
		this.queryString = 
		{
			handyman_category_id:this.resultDataJob.handyman_category_id,
			handyman_category_name:this.resultDataJob.handyman_category_name,
			handyman_category_image:this.resultDataJob.handyman_category_image,
			to_be_show_featured_handyman:"no"
		};
		let navigationExtras: NavigationExtras = 
		{
			queryParams: 
			{
				special: JSON.stringify(this.queryString)
			}
		};
		this.client.router.navigate(['/tabs/post-a-job-location'], navigationExtras);
	}

	async PostAJob(form)
	{
		let handyman_category_id = (form.handyman_category_id) ? form.handyman_category_id : 0;
		let user_id = (form.user_id) ? form.user_id : 0;
		let job_description = (form.job_description) ? form.job_description : "";
		let latitude = (form.latitude) ? form.latitude : "";
		let longitude = (form.longitude) ? form.longitude : "";
		let address = (form.address) ? form.address : "";

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

		let data = 
		{
			handyman_category_id:handyman_category_id,
			user_id:user_id,
			job_description:job_description,
			latitude:latitude,
			longitude:longitude,
			address:address
		}
		await this.client.PostAJob(data).then(resultBook => 
		{	
			loading.dismiss();//DISMISS LOADER			
			this.resultData=resultBook;
			localStorage.removeItem('post-a-job');
			if(this.resultData['id'] > 0)
			{
				this.client.showMessage("Job is added successfully!");
			}
			this.client.router.navigate(['/tabs/home']);
		},
		error => 
		{
			loading.dismiss();//DISMISS LOADER
			console.log();
		});
	}
}
