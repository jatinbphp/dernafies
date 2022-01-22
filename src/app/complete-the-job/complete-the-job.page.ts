import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ClientService } from '../providers/client.service';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-complete-the-job',
  templateUrl: './complete-the-job.page.html',
  styleUrls: ['./complete-the-job.page.scss'],
})

export class CompleteTheJobPage implements OnInit 
{
	public job_id:any='';
	public queryStringData: any=[];
	public language_selected = '';
	public default_language_data: any = [];
	public language_key_exchange_array: any = [];

	public resultDataJobDetail: any=[];
	public resultDataCompletedJobDetail: any=[];
	public resultDataHandyManForJob: any=[];

  	public jobToCompleteForm = this.fb.group({
		job_id: ['', Validators.required],
		job_time_taken_to_complete: ['', Validators.required],
		payment_note: ['', Validators.required]
	});

  	validation_messages = 
	{		
		'job_time_taken_to_complete': 
		[
			{ type: 'required', message: 'Estimated time taken to complete the job.' },
		],
		'payment_note': 
		[
			{ type: 'required', message: 'Payment note is required.' },
		]
	};

	constructor(public client: ClientService, public fb: FormBuilder, public loadingCtrl: LoadingController, private route: ActivatedRoute)
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

		this.route.queryParams.subscribe(params => 
		{
			if(params && params.special)
			{
			this.queryStringData = JSON.parse(params.special);        
			}
		});
		this.job_id=this.queryStringData['job_id'];
		this.jobToCompleteForm.controls['job_id'].setValue(this.job_id);
		//LOADER
		const loadingJob = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loadingJob.present();
		//LOADER
		let dataJob = {
			job_id:(this.job_id) ? this.job_id : 0
		}
		await this.client.getJobDetailById(dataJob).then(result => 
		{	
			loadingJob.dismiss();//DISMISS LOADER			
			this.resultDataJobDetail=result; 
			this.resultDataHandyManForJob=this.resultDataJobDetail.handyman;
			console.log(this.resultDataJobDetail);	
		},
		error => 
		{
			loadingJob.dismiss();//DISMISS LOADER
			console.log();
		});
	}

	async MakeJobCompleted(form)
	{
		let job_id = (form.job_id) ? form.job_id : 0;
		let payment_note = (form.payment_note) ? form.payment_note : "";
		let job_time_taken_to_complete = (form.job_time_taken_to_complete) ? form.job_time_taken_to_complete : 0;
		let payment_status = 1;

		//LOADER
		const loadingCompleteTheJob = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loadingCompleteTheJob.present();
		//LOADER
		let dataJobCompletion = {
			job_id:job_id,
			payment_note:payment_note,
			job_time_taken_to_complete:job_time_taken_to_complete,
			payment_status:1
		}
		
		await this.client.updateJobCompleted(dataJobCompletion).then(result => 
		{	
			loadingCompleteTheJob.dismiss();//DISMISS LOADER			
			this.resultDataCompletedJobDetail=result;
			if(this.resultDataCompletedJobDetail.status == true)
			{
				this.client.showMessage("Job is marked completed!");
				this.client.router.navigate(['/tabs/current-requests']);
			} 
			console.log(this.resultDataCompletedJobDetail);	
		},
		error => 
		{
			loadingCompleteTheJob.dismiss();//DISMISS LOADER
			console.log();
		});
	}
}
