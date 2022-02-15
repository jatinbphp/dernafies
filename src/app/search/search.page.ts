import { Component } from '@angular/core';
import { MenuController, LoadingController, ModalController } from '@ionic/angular';
import { ClientService } from '../providers/client.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfilePage } from '../profile/profile.page';
import { NavigationExtras } from "@angular/router";

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss']
})
export class SearchPage 
{
  public rtl_or_ltr = '';
  public language_selected = '';
	public default_language_data: any = [];

  public queryString: any=[];
  public language_key_exchange_array: any = [];
  
  public handyMinExperience:number=0;
  public handyMaxExperience:number=0;
  public handyMinPrice:number=0;
  public handyMaxPrice:number=0;
  public handyManExperienceInYears: any = [];

  public resultDataCategories: any = [];
  public search_for_handyman: any = [];
  public resultDataSearch: any = [];
  public resultDataSearchPerSlide: any = [];
  public resultDataSearchPerSlideTemp: any = [];
  public handyManToBeShowOnSingleSlide:number = 9;
  public tempH:number=0;
  public HandyManCovered:number=0;
  public currentSlide:number=0;
  public handymanSlide = 
  {
    // slidesPerView: 1.3,
    initialSlide: 1,
    //slidesPerView: this.handymancheckScreen(),
    speed: 600,
  };

  public customPopoverOptions: any = {
    //header: 'Hair Color',
    //subHeader: 'Select your hair color',
    //message: 'Only select your dominant hair color'
  };

  constructor(public fb: FormBuilder, public client: ClientService, public menu: MenuController, public loadingCtrl: LoadingController, public modalCtrl: ModalController) 
  {
    this.default_language_data = this.client.default_language_data;
		this.language_selected = this.client.language_selected;
  }

  async ngOnInit() 
  {
    this.language_key_exchange_array['english']='categoryName';
    this.language_key_exchange_array['arabic']='categoryNameArabic';
    this.language_key_exchange_array['kurdish']='categoryNameKurdi';

    //LOADER
		const loading = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		//await loading.present();
		//LOADER
    await this.client.getCategories().then(result => 
    {	
      loading.dismiss();//DISMISS LOADER			
      this.resultDataCategories=result['data'];
      //console.log(this.resultDataCategories);
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });//CATEGORIES
  }

  async ionViewWillEnter()
  {
    
    this.resultDataSearch=[];//RESET DATA
    this.resultDataSearchPerSlide=[];//RESET DATA
    this.resultDataSearchPerSlideTemp=[];//RESET DATA
    this.HandyManCovered=0;//RESET DATA
    this.currentSlide=0;//RESET DATA
    this.tempH=0;//RESET DATA

    this.search_for_handyman=JSON.parse(localStorage.getItem('search_for_handyman'));
    if(this.search_for_handyman!=null && this.search_for_handyman!=undefined && this.search_for_handyman!='null' && this.search_for_handyman!='undefined')
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
      let objSearch = {
        keyword:(this.search_for_handyman.keyword) ? this.search_for_handyman.keyword : "",
        latitude:(this.search_for_handyman.latitude) ? this.search_for_handyman.latitude : "",
        longitude:(this.search_for_handyman.longitude) ? this.search_for_handyman.longitude : "",
        category_id:(this.search_for_handyman.category_id) ? this.search_for_handyman.category_id : "",
        experience:(this.search_for_handyman.experience) ? this.search_for_handyman.experience : "",
        price_range:(this.search_for_handyman.price_range) ? this.search_for_handyman.price_range : "",
        reviews:(this.search_for_handyman.reviews) ? this.search_for_handyman.reviews : "",  
      }
      await this.client.searchHandyman(objSearch).then(result => 
      {	
        loading.dismiss();//DISMISS LOADER			
        this.resultDataSearch=result['data'];
        console.log("Search Data",this.resultDataSearch);
        if(this.resultDataSearch.length > 0)
        { 
          for(let h=this.HandyManCovered; h < this.resultDataSearch.length; h++)
          {
            this.tempH = this.tempH+1;
            
            let objHandyMan = {
              id:this.resultDataSearch[h].id,
              categoryID:this.resultDataSearch[h].categoryID,
              cityID:this.resultDataSearch[h].cityID,
              dateCreated:this.resultDataSearch[h].dateCreated,
              defaultLanguage:this.resultDataSearch[h].defaultLanguage,
              districtID:this.resultDataSearch[h].districtID,
              email:this.resultDataSearch[h].email,
              firstName:this.resultDataSearch[h].firstName,
              isActive:this.resultDataSearch[h].isActive,
              lastName:this.resultDataSearch[h].lastName,
              profilePic:this.resultDataSearch[h].profilePic,
              pwd:this.resultDataSearch[h].pwd,
              userTypeID:this.resultDataSearch[h].userTypeID,
              no_of_experience:this.resultDataSearch[h].no_of_experience,
              price:this.resultDataSearch[h].price,
            }
            this.resultDataSearchPerSlideTemp.push(objHandyMan);
            if(this.tempH % this.handyManToBeShowOnSingleSlide == 0)
            {
              this.resultDataSearchPerSlide[this.currentSlide]=this.resultDataSearchPerSlideTemp;
              this.resultDataSearchPerSlideTemp=[];
              this.tempH = 0;
              this.currentSlide++;
            }
            else 
            {
              this.resultDataSearchPerSlide[this.currentSlide]=this.resultDataSearchPerSlideTemp;
            }
            this.HandyManCovered++;
          }
          //console.log(this.resultDataSearchPerSlide);
          
        }
      },
      error => 
      {
        loading.dismiss();//DISMISS LOADER
        console.log();
      });
      
      //LOOKING FOR MIN AND MAX EXPERIENCE VALUE
      this.resultDataSearch,
      this.handyMinExperience = Math.min.apply(null, this.resultDataSearch.map(function(item) {
        return item.no_of_experience;
      })),
      this.handyMaxExperience = Math.max.apply(null, this.resultDataSearch.map(function(item) {
        return item.no_of_experience;
      }));
      //console.log("MIN",this.handyMinExperience);
      //console.log("MAX",this.handyMaxExperience);
      //LOOKING FOR MIN AND MAX EXPERIENCE VALUE
      //LOOKING FOR MIN AND MAX PRICE VALUE
      this.resultDataSearch,
      this.handyMinPrice = Math.min.apply(null, this.resultDataSearch.map(function(item) {
        return item.price;
      })),
      this.handyMaxPrice = Math.max.apply(null, this.resultDataSearch.map(function(item) {
        return item.price;
      }));
      //console.log("MIN",this.handyMinPrice);
      //console.log("MAX",this.handyMaxPrice);
      //LOOKING FOR MIN AND MAX PRICE VALUE
    }
    console.log(this.search_for_handyman);
  }

  showHandyMan(id)
  {
    this.queryString = 
    {
      id:id,
      handyman_category_id:0
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

  async showMyProfile()
  {
    let id = (localStorage.getItem('id')) ? localStorage.getItem('id') : undefined;
    if(id!='' && id!='null' && id!=null && id!=undefined && id!='undefined')
    {
      const modal = await this.modalCtrl.create({
        component: ProfilePage,
      });

      return await modal.present();
    }
    else 
    {
      this.client.router.navigate(['sign-in']);  
    }
  }

  searchForHandyMan(form)
  {
    let searched_text = form.controls.search_text.value;
    let objSearch=
    {
      keyword:(searched_text) ? searched_text : "",
      latitude:(this.search_for_handyman.latitude) ? this.search_for_handyman.latitude : "",
      longitude:(this.search_for_handyman.longitude) ? this.search_for_handyman.longitude : "",
      category_id:(this.search_for_handyman.category_id) ? this.search_for_handyman.category_id : 0,
      experience:(this.search_for_handyman.experience) ? this.search_for_handyman.experience : 0,
      price_range:(this.search_for_handyman.price_range) ? this.search_for_handyman.price_range : 0,
      reviews:(this.search_for_handyman.reviews) ? this.search_for_handyman.reviews : 0,
    }
    localStorage.setItem('search_for_handyman',JSON.stringify(objSearch));
    this.ionViewWillEnter();
  }
}
