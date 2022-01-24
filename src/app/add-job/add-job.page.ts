import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ClientService } from '../providers/client.service';
import { FirebaseClientService } from '../providers/firebase-client.service';
import { LoadingController } from '@ionic/angular';
import { InAppBrowser, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { NavigationExtras } from "@angular/router";

@Component({
  selector: 'app-add-job',
  templateUrl: './add-job.page.html',
  styleUrls: ['./add-job.page.scss'],
})

export class AddJobPage implements OnInit 
{
	public language_selected = '';
	public default_language_data: any = [];
	public language_key_exchange_array: any = [];
	public handyManCategories: any = [];
	public selected_category_name:any='';
	public selected_category_image:any='';

	public queryString: any=[];

	public accept_tems:boolean=false;
	public resultData:any=[];
	public resultDataFireBase:any=[];
	public resultDataJob:any=[];
	public resultDataHandyMan:any=[];
	
	public firebase_job_id:any='';

	public BooKAJobForm = this.fb.group({
		handyman_category_id: ['', Validators.required],
		handyman_id: ['', Validators.required],
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
  
	constructor(public client: ClientService, private fireClient: FirebaseClientService, public fb: FormBuilder, public loadingCtrl: LoadingController, private inAppBrowser: InAppBrowser)
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
		
		this.resultDataJob = localStorage.getItem('job');
		this.resultDataJob = JSON.parse(this.resultDataJob);
		
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
			id:this.resultDataJob.handyman_id
		}
		await this.client.getHandymanDetailById(data).then(resultHandyMan => 
		{	
			loading.dismiss();//DISMISS LOADER			
			this.resultDataHandyMan=resultHandyMan;
			console.log(this.resultDataHandyMan);
		},
		error => 
		{
			loading.dismiss();//DISMISS LOADER
			console.log();
		});
		
		if(this.resultDataJob.handyman_category_id > 0)
		{
			this.BooKAJobForm.controls['handyman_category_id'].setValue(this.resultDataJob.handyman_category_id);
		}
		this.handyManCategories=this.resultDataHandyMan.categories;
		if(this.handyManCategories.length > 0)
		{
			for(let c = 0; c < this.handyManCategories.length; c ++)
			{
				if(this.handyManCategories[c].id == this.resultDataJob.handyman_category_id)
				{
					this.selected_category_name = this.handyManCategories[c][this.language_key_exchange_array[this.language_selected]];
					this.selected_category_image = this.handyManCategories[c].categoryImage;
					//console.log(this.selected_category_name);
					//console.log(this.selected_category_image);
				}
			}
		}
		console.log(this.handyManCategories);
		this.BooKAJobForm.controls['handyman_id'].setValue(this.resultDataJob.handyman_id);
		this.BooKAJobForm.controls['user_id'].setValue(this.resultDataJob.user_id);
		this.BooKAJobForm.controls['latitude'].setValue(this.resultDataJob.latitude);
		this.BooKAJobForm.controls['longitude'].setValue(this.resultDataJob.longitude);
		this.BooKAJobForm.controls['address'].setValue(this.resultDataJob.address);
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

	async BookMyJob(form)
	{
		let handyman_category_id = (form.handyman_category_id) ? form.handyman_category_id : 0;
		let handyman_id = (form.handyman_id) ? form.handyman_id : 0;
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
			handyman_id:handyman_id,
			user_id:user_id,
			job_description:job_description,
			latitude:latitude,
			longitude:longitude,
			address:address
		}
		await this.client.BookMyJob(data).then(resultBook => 
		{	
			//loading.dismiss();//DISMISS LOADER			
			this.resultData=resultBook;
			localStorage.removeItem('job');
			if(this.resultData['id'] > 0)
			{
				this.client.showMessage("Job is added successfully!");
			}
			//this.client.router.navigate(['/tabs/current-requests']);
		},
		error => 
		{
			loading.dismiss();//DISMISS LOADER
			console.log();
		});

		//ADD JOB TO FIREBASE, SO MESSAGING BETWEEN CUSTOMER AND HANDYMAN CAN BE INITITATE
		let dataMessage = {
			job_id:this.resultData['id']
		}
		await this.fireClient.addMessageEntryToFirebase(dataMessage).then(result => 
		{	      
			this.resultDataFireBase=result;
			this.firebase_job_id = this.resultDataFireBase['id'];
			console.log(this.firebase_job_id);
			//this.client.router.navigate(['/tabs/current-requests']);
		},
		error => 
		{
			loading.dismiss();//DISMISS LOADER
			console.log(error);
		});
		//ADD JOB TO FIREBASE, SO MESSAGING BETWEEN CUSTOMER AND HANDYMAN CAN BE INITITATE

		//UPDATE FIREBASE AUTOINC ID TO JOB TABLE
		let dataMessageID = {
			job_id:this.resultData['id'],
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

	updateFireBaseMessageID()
	{}

	GoBack()
  	{
		let way_to_select_handyman = JSON.parse(localStorage.getItem('way_to_select_handyman'));
		this.queryString = 
		{
			handyman_category_id:way_to_select_handyman.handyman_category_id,
			handyman_id:way_to_select_handyman.handyman_id
		};
		let navigationExtras: NavigationExtras = 
		{
		queryParams: 
		{
			special: JSON.stringify(this.queryString)
		}
		};
		this.client.router.navigate(['/tabs/handyman-send-location'], navigationExtras);
  	}
}
