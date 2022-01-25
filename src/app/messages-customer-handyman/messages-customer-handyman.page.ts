import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { ClientService } from '../providers/client.service';
import { FirebaseClientService } from '../providers/firebase-client.service';
import { FormBuilder, Validators } from '@angular/forms';
import { format, parseISO } from 'date-fns';
import * as moment from 'moment';

@Component({
  selector: 'app-messages-customer-handyman',
  templateUrl: './messages-customer-handyman.page.html',
  styleUrls: ['./messages-customer-handyman.page.scss'],
})

export class MessagesCustomerHandymanPage implements OnInit 
{
  public rtl_or_ltr = '';
  public language_selected = '';
	public default_language_data: any = [];
  public language_key_exchange_array: any = [];
  public job_id:any = '';
  public user_id:any = '';
  public handyman_id:any = '';
  public role:any = '';
  public firebase_message_id_for_job:any='';
  
  public resultDataAfterMessage: any=[];
  public resultDataJobDetail: any=[];
  public resultDataHandyManForJob: any=[];
  public resultDataCustomerForJob: any=[];
  public resultDataCommunications:any=[];
  public currentDate: any='';

  public MessageBetweenCustomerAndHandyManForm = this.fb.group({
		message: ['', Validators.required],
	});
  
  constructor(public fb: FormBuilder, private fireClient: FirebaseClientService, public client: ClientService, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public navParams: NavParams)
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

    this.role = localStorage.getItem('role');
    this.job_id = this.navParams.get('job_id');
    this.user_id = this.navParams.get('user_id');
    this.handyman_id = this.navParams.get('handyman_id');
    this.firebase_message_id_for_job = this.navParams.get('firebase_message_id_for_job');
    
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
      this.resultDataCustomerForJob=this.resultDataJobDetail.customer;
			console.log(this.resultDataJobDetail);	
		},
		error => 
		{
			loadingJob.dismiss();//DISMISS LOADER
			console.log();
		});

    //MESSAGES BETWEEN HOST AND USER
    this.resultDataCommunications=[];
    this.fireClient.getBookingCommunication(this.firebase_message_id_for_job).subscribe(communications => {
      this.resultDataCommunications = communications;
      console.log(this.resultDataCommunications);
    });
    //MESSAGES BETWEEN HOST AND USER
  }

  dismissModal()
	{
		this.modalCtrl.dismiss({
			'dismissed': true
		});
  }

  async sendMessage(form)
  {
    let job_id = (this.job_id) ? this.job_id : 0;
    let user_id = (this.user_id) ? this.user_id : 0;
    let user_name = this.resultDataCustomerForJob.firstName+" "+this.resultDataCustomerForJob.lastName;
    let user_image = this.resultDataCustomerForJob.profilePic;
    let handyman_id = (this.handyman_id) ? this.handyman_id : 0;
    let handyman_name = this.resultDataHandyManForJob.firstName+" "+this.resultDataHandyManForJob.lastName;
    let handyman_image = this.resultDataHandyManForJob.profilePic;
    let message = (form.message) ? form.message : "";
    let customer_has_readed = (this.role == 'customer') ? 1 : 0;
    let handyman_has_readed = (this.role == 'handyman') ? 1 : 0;
    let message_added_by = (this.role) ? this.role : "";
    let firebase_message_id_for_job = (this.firebase_message_id_for_job) ? this.firebase_message_id_for_job : "";
    //let currentDate = new Date().toISOString();
    //this.currentDate=format(parseISO(currentDate), 'yyyy-MM-dd hh:mm:ss');
    //let message_added_date = this.currentDate;
    let message_added_date = moment().format('YYYY-MM-DD hh:mm:ss');
    this.currentDate=message_added_date;
    let sendMessageObj = {
      job_id: job_id,
      user_id: user_id,
      user_name: user_name,
      user_image: user_image,
      handyman_id: handyman_id,
      handyman_name: handyman_name,
      handyman_image: handyman_image,
      message: message,
      customer_has_readed: customer_has_readed,
      handyman_has_readed: handyman_has_readed,
      message_added_date: message_added_date,
      message_added_by:message_added_by,
      firebase_message_id_for_job:firebase_message_id_for_job
    }
    
    this.MessageBetweenCustomerAndHandyManForm.controls['message'].setValue("");
    await this.fireClient.sendBookingMessage(firebase_message_id_for_job,sendMessageObj).then(result => 
    {	      
      this.resultDataAfterMessage=result;      
    },
    error => 
    {
      console.log(error);
    })
  }
}
