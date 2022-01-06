import { Component } from '@angular/core';
import { MenuController, LoadingController, ModalController } from '@ionic/angular';
import { ClientService } from '../providers/client.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfilePage } from '../profile/profile.page';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class HomePage 
{
  public rtl_or_ltr = '';
  public language_selected = '';
	public default_language_data: any = [];
  
  public id:any = '';
  public role:any = '';
  public welcome_text:any = '';
  public greetings:any = '';

  public queryString: any=[];
  public resultDataFeaturedHandyMan: any = [];
  public resultDataCategories: any = [];
  public language_key_exchange_array: any = [];
  public categorieSlide = 
  {
    //slidesPerView: 1.3,
    initialSlide: 1,
    slidesPerView: this.categoriecheckScreen(),
    speed: 600,
  };  

  constructor(public fb: FormBuilder, public client: ClientService, public menu: MenuController, public loadingCtrl: LoadingController, public modalCtrl: ModalController) 
  {
    this.client.getObservableOnLanguageChange().subscribe((data) => {
			this.language_selected = data.language_selected;
			this.rtl_or_ltr = (this.language_selected == 'arabic') ? 'rtl' : 'ltr';
			console.log('Data received', data);
		});//THIS OBSERVABLE IS USED TO SET DEFAULT OR SELECTED LANGUAGE
		this.rtl_or_ltr = (this.language_selected == 'arabic') ? 'rtl' : 'ltr';
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
		await loading.present();
		//LOADER
    await this.client.getCategories().then(result => 
    {	
      loading.dismiss();//DISMISS LOADER			
      this.resultDataCategories=result;
      console.log(this.resultDataCategories);
            
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });//CATEGORIES

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
    let dataHandyMan = {
      categoryID:''
    }
    await this.client.getActivehandyman(dataHandyMan).then(result => 
    {	
      loadingFeaturedHandyMan.dismiss();//DISMISS LOADER			
      this.resultDataFeaturedHandyMan=result; 
      console.log(this.resultDataFeaturedHandyMan);
            
    },
    error => 
    {
      loadingFeaturedHandyMan.dismiss();//DISMISS LOADER
      console.log();
    });//FEATURED HANDYMAN
  }

  async ionViewWillEnter()
  {
    this.default_language_data = this.client.default_language_data;
		this.language_selected = this.client.language_selected;
    //this.rtl_or_ltr = this.client.rtl_or_ltr;
    console.log(this.rtl_or_ltr);
    
    this.id=localStorage.getItem('id');
    this.role=localStorage.getItem('role');
    
    if(this.id!='' && this.id!=null && this.id!=undefined && this.id!='null' && this.id!='undefined')
    {
      let today = new Date()
      let curHr = today.getHours()
      if(curHr < 12)
      {
        if(this.language_selected == "english")
        {
          this.greetings='Good Morning';
        }
        if(this.language_selected == "arabic")
        {
          this.greetings='صباح الخير';
        }
        if(this.language_selected == "kurdish")
        {
          this.greetings='Roj baş';
        }
      }
      else if (curHr < 18) 
      {
        if(this.language_selected == "english")
        {
          this.greetings='Good Afternoon';
        }
        if(this.language_selected == "arabic")
        {
          this.greetings='طاب مسائك';
        }
        if(this.language_selected == "kurdish")
        {
          this.greetings='Paş nîvro';
        }
      }
      else
      {
        if(this.language_selected == "english")
        {
          this.greetings='Good Evening';
        }
        if(this.language_selected == "arabic")
        {
          this.greetings='مساء الخير';
        }
        if(this.language_selected == "kurdish")
        {
          this.greetings='Êvar baş';
        }
      }
      let firstName = (localStorage.getItem('firstName')) ? localStorage.getItem('firstName') : "";
      let lastName = (localStorage.getItem('lastName')) ? localStorage.getItem('lastName') : "";
      this.welcome_text = 'Hi, '+firstName+' '+lastName;      
    }
  }

  
  
  categoriecheckScreen() {
    let innerWidth = window.innerWidth;
    switch (true) {
      case 320 <= innerWidth && innerWidth <= 374:
        return 1.6;
      case 375 <= innerWidth && innerWidth <= 475:
        return 2.6;
      case 476 <= innerWidth && innerWidth <= 575:
        return 2.6;
      case 576 <= innerWidth && innerWidth <= 700:
        return 3.6;
      case 701 <= innerWidth && innerWidth <= 900:
        return 4.3;
      case 901 <= innerWidth && innerWidth <= 991:
        return 4.3;
      case 992 <= innerWidth && innerWidth <= 1025:
        return 4.3;
      case 1026 <= innerWidth && innerWidth <= 1199:
        return 4.3;
      case 1200 <= innerWidth:
        return 5.3;
    }
  }

  featuredSlide = {
    // slidesPerView: 1.3,
    initialSlide: 1,
    slidesPerView: this.featuredcheckScreen(),
    speed: 600,
  };
  
  featuredcheckScreen() {
    let innerWidth = window.innerWidth;
    switch (true) {
      case 320 <= innerWidth && innerWidth <= 374:
        return 1.6;
      case 375 <= innerWidth && innerWidth <= 475:
        return 2.6;
      case 476 <= innerWidth && innerWidth <= 575:
        return 2.6;
      case 576 <= innerWidth && innerWidth <= 700:
        return 3.6;
      case 701 <= innerWidth && innerWidth <= 900:
        return 4.3;
      case 901 <= innerWidth && innerWidth <= 991:
        return 4.3;
      case 992 <= innerWidth && innerWidth <= 1025:
        return 4.3;
      case 1026 <= innerWidth && innerWidth <= 1199:
        return 4.3;
      case 1200 <= innerWidth:
        return 5.3;
    }
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
  
  viewAllHandyMan()
  {
    this.client.router.navigate(['/tabs/handyman-view-all']);
    /*
    this.client.router.navigate(['/tabs/handyman-view-all']).then(()=>{
      window.location.reload();
    });
    */
  }

  showHandyManByCategory(id)
  {
    this.queryString = 
    {
      id:id
    };

    let navigationExtras: NavigationExtras = 
    {
      queryParams: 
      {
        special: JSON.stringify(this.queryString)
      }
    };
    this.client.router.navigate(['/tabs/handyman-view-all'], navigationExtras);
    /*
    this.client.router.navigate(['/tabs/handyman-view-all'], navigationExtras).then(()=>{
      window.location.reload();
    });
    */
  }

  showHandyMan(id)
  {
    this.queryString = 
    {
      id:id
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
