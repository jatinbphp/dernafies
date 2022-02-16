import { Component } from '@angular/core';
import { Platform, MenuController, LoadingController, ModalController, AlertController } from '@ionic/angular';
import { ClientService } from '../providers/client.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfilePage } from '../profile/profile.page';
import { JobLocationOnMapPage } from '../job-location-on-map/job-location-on-map.page';
import { NavigationExtras } from '@angular/router';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';

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
  
  public search_text:any = '';
  
  public id:any = '';
  public role:any = '';
  public user_type:any = '';
  public welcome_text:any = '';
  public greetings:any = '';
  public current_latitude:any = '';
  public current_longitude:any = '';

  public queryString: any=[];
  public resultDataFeaturedHandyMan: any = [];
  public resultDataCategories: any = [];
  public resultJobUpdatedStatus: any = [];
  public language_key_exchange_array: any = [];
  public province_language_key_exchange_array: any = [];
  
  public device_id: string = '';//PUSH NOTIFICATION
  public device_type: string = '';//PUSH NOTIFICATION
	public deviceUpdateInfo:any=[];//PUSH NOTIFICATION

  public categorieSlide = 
  {
    //slidesPerView: 1.3,
    initialSlide: 1,
    slidesPerView: this.categoriecheckScreen(),
    speed: 600,
  };  

  public jobRequestsHandyMan: any=[];
  public completedJobRequestsHandyMan: any=[];

  constructor(public fb: FormBuilder, public client: ClientService, public menu: MenuController, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public alertController: AlertController, private geolocation: Geolocation, private platform: Platform, private nativeGeocoder: NativeGeocoder) 
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

    this.province_language_key_exchange_array['english']='provinceName';
    this.province_language_key_exchange_array['arabic']='provinceNameArabic';
    this.province_language_key_exchange_array['kurdish']='provinceNameKurdi';
    
    this.id=localStorage.getItem('id');
    this.role = localStorage.getItem('role');
    
    this.UpdatePushToken();
    this.showHomeContent();
  }

  async ionViewWillEnter()
  {
    this.default_language_data = this.client.default_language_data;
		this.language_selected = this.client.language_selected;
    //this.rtl_or_ltr = this.client.rtl_or_ltr;
    console.log(this.rtl_or_ltr);
    this.id=localStorage.getItem('id');
    this.role = localStorage.getItem('role');
    this.user_type = (this.role == 'handyman') ? 2 : 3;
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
    /*
    if(this.role == 'customer')
    {
      this.platform.ready().then(async () => 
      {
        const coordinates = await this.geolocation.getCurrentPosition();
        this.current_latitude=Number(coordinates.coords.latitude);
        this.current_longitude=Number(coordinates.coords.longitude);
      });
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
      //await loadingFeaturedHandyMan.present();
      //LOADER
      let dataHandyMan = {
        categoryID:0,
        latitude:this.current_latitude,
        longitude:this.current_longitude,
        limit:3
      }
      await this.client.getFeaturedHandyman(dataHandyMan).then(result => 
      {	
        loadingFeaturedHandyMan.dismiss();//DISMISS LOADER			
        this.resultDataFeaturedHandyMan=result; 
        console.log("Featured",this.resultDataFeaturedHandyMan);
              
      },
      error => 
      {
        loadingFeaturedHandyMan.dismiss();//DISMISS LOADER
        console.log();
      });//FEATURED HANDYMAN

      //LOADER
      const loadingHandyManCompletedJobRequests = await this.loadingCtrl.create({
        spinner: null,
        //duration: 5000,
        message: 'Please wait...',
        translucent: true,
        cssClass: 'custom-class custom-loading'
      });
      //await loadingHandyManCompletedJobRequests.present();
      //LOADER
      let dataHandyManJobRequest = {
        user_id:this.id,        
        user_type:this.user_type
      }
      await this.client.getJobRequestsForHandyMan(dataHandyManJobRequest).then(result => 
      {	
        loadingHandyManCompletedJobRequests.dismiss();//DISMISS LOADER			
        this.completedJobRequestsHandyMan=result['completed']; 
        console.log("COMPLETED JOBS",this.completedJobRequestsHandyMan);
              
      },
      error => 
      {
        loadingHandyManCompletedJobRequests.dismiss();//DISMISS LOADER
        console.log();
      });//COMPLETED JOB REQUESTS FOR HANDYMAN
    }
    if(this.role == 'handyman')
    {
      //LOADER
      const loadingHandyManRequests = await this.loadingCtrl.create({
        spinner: null,
        //duration: 5000,
        message: 'Please wait...',
        translucent: true,
        cssClass: 'custom-class custom-loading'
      });
      //await loadingHandyManRequests.present();
      //LOADER
      let dataHandyManJobRequest = {
        user_id:this.id,        
        user_type:this.user_type
      }
      await this.client.getJobRequestsForHandyMan(dataHandyManJobRequest).then(result => 
      {	
        loadingHandyManRequests.dismiss();//DISMISS LOADER			
        this.jobRequestsHandyMan=result['requested']; 
        console.log("JOBS",this.jobRequestsHandyMan);
              
      },
      error => 
      {
        loadingHandyManRequests.dismiss();//DISMISS LOADER
        console.log();
      });//JOB REQUESTS FOR HANDYMAN
    }
    */
  }

  async UpdatePushToken()
	{	
		await this.platform.ready().then(() => 
    {
      if(this.platform.is('android')) 
      {
        localStorage.setItem('device_type','android');
      }
      if(this.platform.is('ios')) 
      {
        localStorage.setItem('device_type','ios');
      }
    });//PUSH NOTIFICATION

    this.device_id = (localStorage.getItem('device_id')) ? localStorage.getItem('device_id') : "";
    this.device_type = (localStorage.getItem('device_type')) ? localStorage.getItem('device_type') : "";
    if(this.device_id != null && this.device_id != undefined && this.device_id && this.device_type)
		{	
      let dataToUpdate = 
      {
        user_id : this.id,
        device_id: this.device_id,
        device_type: this.device_type
      }
      await this.client.UpdatePushToken(dataToUpdate).then(result => 
      {
        this.deviceUpdateInfo = result;
        console.log("Device Info",this.deviceUpdateInfo);        
      },
      error => 
      {
        console.log();
      });
		}
	}//PUSH NOTIFICATION

  async showHomeContent()
  {
    this.default_language_data = this.client.default_language_data;
		this.language_selected = this.client.language_selected;
    this.jobRequestsHandyMan=[];
    this.completedJobRequestsHandyMan=[];
    this.resultDataFeaturedHandyMan=[];
    //this.rtl_or_ltr = this.client.rtl_or_ltr;
    console.log(this.rtl_or_ltr);
    this.id=localStorage.getItem('id');
    this.role = localStorage.getItem('role');
    this.user_type = (this.role == 'handyman') ? 2 : 3;
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
    if(this.role == 'customer')
    {
      await this.platform.ready().then(async () => 
      {
        const coordinates = await this.geolocation.getCurrentPosition();
        this.current_latitude=Number(coordinates.coords.latitude);
        this.current_longitude=Number(coordinates.coords.longitude);
      });
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
      //await loadingFeaturedHandyMan.present();
      //LOADER
      let dataHandyMan = {
        categoryID:0,
        latitude:this.current_latitude,
        longitude:this.current_longitude,
        limit:3
      }
      await this.client.getFeaturedHandyman(dataHandyMan).then(result => 
      {	
        loadingFeaturedHandyMan.dismiss();//DISMISS LOADER			
        this.resultDataFeaturedHandyMan=result; 
        console.log("Featured",this.resultDataFeaturedHandyMan);
              
      },
      error => 
      {
        loadingFeaturedHandyMan.dismiss();//DISMISS LOADER
        console.log();
      });//FEATURED HANDYMAN

      //LOADER
      const loadingHandyManCompletedJobRequests = await this.loadingCtrl.create({
        spinner: null,
        //duration: 5000,
        message: 'Please wait...',
        translucent: true,
        cssClass: 'custom-class custom-loading'
      });
      //await loadingHandyManCompletedJobRequests.present();
      //LOADER
      let dataHandyManJobRequest = {
        user_id:this.id,        
        user_type:this.user_type
      }
      await this.client.getJobRequestsForHandyMan(dataHandyManJobRequest).then(result => 
      {	
        loadingHandyManCompletedJobRequests.dismiss();//DISMISS LOADER			
        this.completedJobRequestsHandyMan=result['completed']; 
        console.log("COMPLETED JOBS",this.completedJobRequestsHandyMan);
              
      },
      error => 
      {
        loadingHandyManCompletedJobRequests.dismiss();//DISMISS LOADER
        console.log();
      });//COMPLETED JOB REQUESTS FOR HANDYMAN
    }
    if(this.role == 'handyman')
    {
      //LOADER
      const loadingHandyManRequests = await this.loadingCtrl.create({
        spinner: null,
        //duration: 5000,
        message: 'Please wait...',
        translucent: true,
        cssClass: 'custom-class custom-loading'
      });
      //await loadingHandyManRequests.present();
      //LOADER
      let dataHandyManJobRequest = {
        user_id:this.id,        
        user_type:this.user_type
      }
      await this.client.getJobRequestsForHandyMan(dataHandyManJobRequest).then(result => 
      {	
        loadingHandyManRequests.dismiss();//DISMISS LOADER			
        this.jobRequestsHandyMan=result['requested']; 
        console.log("JOBS",this.jobRequestsHandyMan);
              
      },
      error => 
      {
        loadingHandyManRequests.dismiss();//DISMISS LOADER
        console.log();
      });//JOB REQUESTS FOR HANDYMAN
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

  showHandyManByCategory(id)
  {
    this.queryString = 
    {
      handyman_category_id:id,
      latitude:this.current_latitude,
      longitude:this.current_longitude,
      to_be_show_featured_handyman:"no"
    };
    localStorage.setItem("way_to_select_handyman",JSON.stringify(this.queryString));
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

  showAllHandyMan()
  {
    this.queryString = 
    {
      handyman_category_id:0,
      latitude:this.current_latitude,
      longitude:this.current_longitude,
      to_be_show_featured_handyman:"yes"
    };
    localStorage.setItem("way_to_select_handyman",JSON.stringify(this.queryString));
    let navigationExtras: NavigationExtras = 
    {
      queryParams: 
      {
        special: JSON.stringify(this.queryString)
      }
    };
    this.client.router.navigate(['/tabs/handyman-view-all'], navigationExtras);
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
    let obj_way_to_select_handyman = 
    {
        handyman_category_id:0,
        latitude:this.current_latitude,
        longitude:this.current_longitude,
        to_be_show_featured_handyman:"yes"
    };
    localStorage.setItem("way_to_select_handyman",JSON.stringify(obj_way_to_select_handyman));
    this.client.router.navigate(['/tabs/handyman-selected'], navigationExtras);
  }

  async showMapWithLocations(job_id,handyman_id,job_latitude,job_longitude)
  {
    const modal = await this.modalCtrl.create({
      component: JobLocationOnMapPage,
      componentProps: 
			{ 
				job_id: job_id,
				handyman_id: handyman_id,
				job_latitude: job_latitude,
				job_longitude: job_longitude
			}
    });

    return await modal.present();
  }

  async confirmUpdateJobStatusHandyMan(job_id,status_to_update)
  {
    let status = (status_to_update == 2) ? "Accept" : "Reject";
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Dernafies',
      message: 'Please confirm:<br />\nAre you sure to <strong>'+status+'</strong> this service request?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => 
          {
            console.log('Confirm Cancel: blah');
          }
        }, 
        {
          text: 'Okay',
          handler: () => 
          {
            this.UpdateJobStatus(job_id,status_to_update);
            console.log('Confirm Okay');
          }
        }
      ]
    });
    await alert.present();
  }

  async UpdateJobStatus(job_id,status_to_update)
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
    let dataJobStatus = {
      job_id:job_id,        
      status_to_update:status_to_update
    }
    await this.client.UpdateJobStatus(dataJobStatus).then(result => 
    {	
      loading.dismiss();//DISMISS LOADER			
      this.resultJobUpdatedStatus=result; 
      this.client.showMessage(this.resultJobUpdatedStatus['message']);
      this.showHomeContent();
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });//JOB REQUESTS FOR HANDYMAN    
  }
  
  addReviewAndRating(job_id,handyman_category_nm,handyman_id)
  {
    
    this.queryString = 
    {
      job_id:job_id,
      handyman_category_nm:handyman_category_nm,
      handyman_id:handyman_id
    };

    let navigationExtras: NavigationExtras = 
    {
      queryParams: 
      {
        special: JSON.stringify(this.queryString)
      }
    };
    this.client.router.navigate(['/tabs/review-and-rating'], navigationExtras);
  }

  doRefresh(ev)
  {
    setTimeout(() => 
    {
        this.showHomeContent();
        ev.target.complete();
    }, 2000);
  }

  searchForHandyMan(form)
  {
    let searched_text = (form.controls.search_text.value) ? form.controls.search_text.value : "";
    let objSearch=
    {
      keyword:(searched_text) ? searched_text : "",
      latitude:(this.current_latitude) ? this.current_latitude : "",
      longitude:(this.current_longitude) ? this.current_longitude : "",
      category_id:0,
      experience:0,
      price_range:0,
      reviews:0,
    }
    localStorage.setItem('search_for_handyman',JSON.stringify(objSearch));
    this.client.router.navigate(['tabs/search']);
  }
}
