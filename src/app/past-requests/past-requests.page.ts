import { Component, OnInit } from '@angular/core';
import { ClientService } from '../providers/client.service';
import { LoadingController } from '@ionic/angular';

@Component({
	selector: 'app-past-requests',
	templateUrl: './past-requests.page.html',
	styleUrls: ['./past-requests.page.scss'],
})

export class PastRequestsPage implements OnInit 
{
	public rtl_or_ltr = '';
	public language_selected = '';
	public default_language_data: any = [];
	public language_key_exchange_array: any = [];

	public show_in_view: any = 'list';
	public id:any = '';
  	public role:any = '';
  	public user_type:any = '';
	public jobRequestsHandyMan: any=[];

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
		const loadingHandyManRequests = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loadingHandyManRequests.present();
		//LOADER
		
		let dataHandyManJobRequest = {
			user_id:this.id,        
			user_type:this.user_type
		}
		
		await this.client.getJobRequestsForHandyMan(dataHandyManJobRequest).then(result => 
		{	
			loadingHandyManRequests.dismiss();//DISMISS LOADER			
			this.jobRequestsHandyMan=result['completed']; 
			console.log("JOBS",this.jobRequestsHandyMan);
				
		},
		error => 
		{
			loadingHandyManRequests.dismiss();//DISMISS LOADER
			console.log();
		});//JOB REQUESTS FOR HANDYMAN
	}

	showGridView() 
	{
		this.show_in_view='grid';
	}

	showListView() 
	{
		this.show_in_view='list';
	}
	
}
