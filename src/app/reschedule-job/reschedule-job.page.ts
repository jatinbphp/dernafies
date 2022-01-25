import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { ClientService } from '../providers/client.service';
import { FormBuilder, Validators } from '@angular/forms';
import { format, parseISO } from 'date-fns';
import { IonDatetime } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-reschedule-job',
  templateUrl: './reschedule-job.page.html',
  styleUrls: ['./reschedule-job.page.scss'],
})

export class RescheduleJobPage implements OnInit 
{
  @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;

  public rtl_or_ltr = '';
  public language_selected = '';
	public default_language_data: any = [];
  public language_key_exchange_array: any = [];
  public currentDate:any='';
  public job_id:any = '';
  public id:any = '';
  public role:any = '';
  public user_type:any = '';
  
  public resultJobRescheduled: any=[];
  public resultDataJobDetail: any=[];
  public resultDataHandyManForJob: any=[];
  
  public jobToRescheduleForm = this.fb.group({
		job_id: ['', Validators.required],
		schedule_to_date: ['', Validators.required],
	});

  validation_messages = 
	{		
		'schedule_to_date': 
		[
			{ type: 'required', message: 'Date is required.' },
		]
	};

  constructor(public fb: FormBuilder, public client: ClientService, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public navParams: NavParams)
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
    //let currentDate = new Date().toISOString();
    //this.currentDate=format(parseISO(currentDate), 'yyyy-MM-dd');
    let currentDate = moment().format('YYYY-MM-DD hh:mm:ss');
    this.currentDate = currentDate;
    this.id=localStorage.getItem('id');
    this.role = localStorage.getItem('role');
    this.user_type = (this.role == 'handyman') ? 2 : 3;
    this.job_id = this.navParams.get('job_id');
    this.jobToRescheduleForm.controls['job_id'].setValue(this.job_id);
    this.jobToRescheduleForm.controls['schedule_to_date'].setValue(this.currentDate);
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

  dismissModal()
	{
		this.modalCtrl.dismiss({
			'dismissed': true
		});
  }

  async MakeReschedule(form)
  {
    this.modalCtrl.dismiss({
			'dismissed': true
		});
    
    let job_id = (form.job_id) ? form.job_id : 0;
    let schedule_to_date = (form.schedule_to_date) ? form.schedule_to_date : 0;
    let schedule_to_date_formated = format(parseISO(schedule_to_date), 'yyyy-MM-dd');
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

    let dataReschedule = {
      job_id:job_id,
      schedule_to_date:schedule_to_date_formated,
      schedule_by:this.role
    }

    await this.client.scheduleJob(dataReschedule).then(result => 
    {	
      loadingJob.dismiss();//DISMISS LOADER			
      this.resultJobRescheduled=result; 
      if(this.resultJobRescheduled.status == true)
      {
        this.client.showMessage(this.resultJobRescheduled.message);
        this.client.router.navigate(['/tabs/current-requests']);
      }
    },
    error => 
    {
      loadingJob.dismiss();//DISMISS LOADER
      console.log();
    });
  }
}
