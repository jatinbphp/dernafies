import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ClientService } from '../providers/client.service';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";

@Component({
  selector: 'app-handyman-view-all',
  templateUrl: './handyman-view-all.page.html',
  styleUrls: ['./handyman-view-all.page.scss'],
})

export class HandymanViewAllPage implements OnInit 
{
  

  public rtl_or_ltr = '';
  public language_selected = '';
	public default_language_data: any = [];
  public language_key_exchange_array: any = [];

  public handyman_category_id:any=0;
  public resultDataHandyMan: any = [];  
  public resultDataHandyManPerSlide: any = [];
  public resultDataHandyManPerSlideTemp: any = [];
  public handyManToBeShowOnSingleSlide:number = 9;
  public HandyManCovered:number=0;
  public currentSlide:number=0;
  public tempH:number=0;
  public queryString: any=[];
  public queryStringData: any=[];

  public handymanSlide = 
  {
    // slidesPerView: 1.3,
    initialSlide: 1,
    //slidesPerView: this.handymancheckScreen(),
    speed: 600,
  };

  constructor(public client: ClientService, public loadingCtrl: LoadingController, private route: ActivatedRoute) 
  { 
    this.client.getObservableOnLanguageChange().subscribe((data) => {
			this.language_selected = data.language_selected;
			this.rtl_or_ltr = (this.language_selected == 'arabic') ? 'rtl' : 'ltr';
			console.log('Data received', data);
		});//THIS OBSERVABLE IS USED TO SET DEFAULT OR SELECTED LANGUAGE
  }

  async ngOnInit() 
  {
    this.default_language_data = this.client.default_language_data;
		this.language_selected = this.client.language_selected;
		this.rtl_or_ltr = (this.language_selected == 'arabic') ? 'rtl' : 'ltr';
    
    this.language_key_exchange_array['english']='categoryName';
    this.language_key_exchange_array['arabic']='categoryNameArabic';
    this.language_key_exchange_array['kurdish']='categoryNameKurdi';
  }

  async ionViewWillEnter()
  {
    this.resultDataHandyMan=[];//RESET DATA
    this.resultDataHandyManPerSlide=[];//RESET DATA
    this.resultDataHandyManPerSlideTemp=[];//RESET DATA
    this.HandyManCovered=0;//RESET DATA
    this.currentSlide=0;//RESET DATA
    this.tempH=0;//RESET DATA
    this.queryStringData=[];//RESET DATA
    
    //LOADER
		const loadingFeaturedHandyMan = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loadingFeaturedHandyMan.present();
		//LOADER

    this.route.queryParams.subscribe(params => 
    {
      if(params && params.special)
      {
        this.queryStringData = JSON.parse(params.special);        
      }
    });
    this.handyman_category_id=this.queryStringData['handyman_category_id'];
    
    let dataHandyMan = {
      categoryID:(this.handyman_category_id) ? this.handyman_category_id : 0
    }
    await this.client.getActivehandyman(dataHandyMan).then(result => 
    {	
      loadingFeaturedHandyMan.dismiss();//DISMISS LOADER			
      this.resultDataHandyMan=result; 
      console.log(this.resultDataHandyMan);
            
    },
    error => 
    {
      loadingFeaturedHandyMan.dismiss();//DISMISS LOADER
      console.log();
    });//FEATURED HANDYMAN

    if(this.resultDataHandyMan.length > 0)
    { 
      for(let h=this.HandyManCovered; h < this.resultDataHandyMan.length; h++)
      {
        this.tempH = this.tempH+1;
        
        let objHandyMan = {
          id:this.resultDataHandyMan[h].id,
          categoryID:this.resultDataHandyMan[h].categoryID,
          cityID:this.resultDataHandyMan[h].cityID,
          dateCreated:this.resultDataHandyMan[h].dateCreated,
          defaultLanguage:this.resultDataHandyMan[h].defaultLanguage,
          districtID:this.resultDataHandyMan[h].districtID,
          email:this.resultDataHandyMan[h].email,
          firstName:this.resultDataHandyMan[h].firstName,
          isActive:this.resultDataHandyMan[h].isActive,
          lastName:this.resultDataHandyMan[h].lastName,
          profilePic:this.resultDataHandyMan[h].profilePic,
          pwd:this.resultDataHandyMan[h].pwd,
          userTypeID:this.resultDataHandyMan[h].userTypeID,
          no_of_experience:this.resultDataHandyMan[h].no_of_experience,
          price:this.resultDataHandyMan[h].price,
        }
        this.resultDataHandyManPerSlideTemp.push(objHandyMan);
        if(this.tempH % this.handyManToBeShowOnSingleSlide == 0)
        {
          this.resultDataHandyManPerSlide[this.currentSlide]=this.resultDataHandyManPerSlideTemp;
          this.resultDataHandyManPerSlideTemp=[];
          this.tempH = 0;
          this.currentSlide++;
        }
        else 
        {
          this.resultDataHandyManPerSlide[this.currentSlide]=this.resultDataHandyManPerSlideTemp;
        }
        this.HandyManCovered++;
      }
      console.log(this.resultDataHandyManPerSlide);
    }
  }
  
  showHandyMan(id)
  {
    this.queryString = 
    {
      id:id,
      handyman_category_id:(this.handyman_category_id) ? this.handyman_category_id : 0
    };

    let navigationExtras: NavigationExtras = 
    {
      queryParams: 
      {
        special: JSON.stringify(this.queryString)
      }
    };
    this.client.router.navigate(['/tabs/handyman-selected'], navigationExtras);
  }
}
