import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ClientService } from '../providers/client.service';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-review-and-rating',
  templateUrl: './review-and-rating.page.html',
  styleUrls: ['./review-and-rating.page.scss'],
})

export class ReviewAndRatingPage implements OnInit 
{
  @ViewChild('rating') rating : any;

  public rtl_or_ltr = '';
  public language_selected = '';
	public default_language_data: any = [];
  public queryStringData: any=[];

  public job_id:any = '';
  public handyman_category_nm:any = '';
  public handyman_id:any = '';
  public resultDataHandyMan: any=[];
  public resultDataHandyManRatingAndReview: any=[];
  public ReviewAndRatingForm = this.fb.group({
		job_id: ['', Validators.required],
    handyman_rating: ['', Validators.required],
		handyman_review: ['', Validators.required]
	});

  validation_messages = 
	{		
		'handyman_rating': 
		[
			{ type: 'required', message: 'Rating is required.' },
		],
		'handyman_review': 
		[
			{ type: 'required', message: 'Review is required.' }
		]
	};
  
  constructor(public fb: FormBuilder, public client: ClientService, public loadingCtrl: LoadingController, private route: ActivatedRoute)
  { 
    this.default_language_data = this.client.default_language_data;
		this.language_selected = this.client.language_selected;
  }

  ngOnInit()
  { }

  async ionViewWillEnter()
  {
    this.route.queryParams.subscribe(params => 
    {
      if(params && params.special)
      {
        this.queryStringData = JSON.parse(params.special);        
      }
    });
    this.job_id=this.queryStringData['job_id'];
    this.handyman_category_nm=this.queryStringData['handyman_category_nm'];
    this.handyman_id=this.queryStringData['handyman_id'];
    this.ReviewAndRatingForm.controls['job_id'].setValue(this.job_id);

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
    let data = {
      id:this.handyman_id
    }
    await this.client.getHandymanDetailById(data).then(result => 
    {
      loading.dismiss();//DISMISS LOADER			
			this.resultDataHandyMan=result;
      console.log(this.resultDataHandyMan);
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });
  }

  onRatingChange(ev)
  {
    this.ReviewAndRatingForm.controls['handyman_rating'].setValue(ev);
    console.log(ev);
  }

  async addReviewAndRating(form)
  {
    let job_id = (form.job_id) ? form.job_id : 0;
    let handyman_rating = (form.handyman_rating) ? form.handyman_rating : 0;
    let handyman_review = (form.handyman_review) ? form.handyman_review : "";

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
    let data = {
      job_id:job_id,
      handyman_rating:handyman_rating,
      handyman_review:handyman_review,
    }
    await this.client.addReviewAndRating(data).then(result => 
    {
      loading.dismiss();//DISMISS LOADER			
			this.resultDataHandyManRatingAndReview=result;
      if(this.resultDataHandyManRatingAndReview['status']==true)
      {
        this.client.showMessage(this.resultDataHandyManRatingAndReview['message']);
      }
      this.ReviewAndRatingForm.reset();
      this.client.router.navigate(['/tabs/current-requests']);
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });
  }
}
