import { Component } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { ClientService } from '../providers/client.service';
import { NavigationExtras } from '@angular/router';
import { ProfilePage } from '../profile/profile.page';

@Component({
  selector: 'app-post-a-job',
  templateUrl: './post-a-job.page.html',
  styleUrls: ['./post-a-job.page.scss'],
})

export class PostAJobPage  
{

  public rtl_or_ltr = '';
  public language_selected = '';
	public default_language_data: any = [];  

  public resultDataCategories: any = [];
  public language_key_exchange_array: any = [];
  public queryString: any=[];
  public resultDataSelectedCategories: any = [];
  public joinResultDataSelectedCategories:any = '';

  constructor(public client: ClientService, public modalCtrl: ModalController, public loadingCtrl: LoadingController) 
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
  }


  removeUnCheckedCategories(arr,what) 
  {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) 
    {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) 
        {
            arr.splice(ax, 1);
        }
    }
    return arr;
  }

  selectedCategories(ev)
  {
    if(ev.detail.checked == true)
    {
      this.resultDataSelectedCategories.push(ev.detail.value);
    }
    if(ev.detail.checked == false)
    {
      this.resultDataSelectedCategories=this.removeUnCheckedCategories(this.resultDataSelectedCategories,ev.detail.value);      
    }
    this.joinResultDataSelectedCategories=this.resultDataSelectedCategories.join(",");
    
  }

  postJobForCategory(id,name,image)
  {
    this.queryString = 
    {
      handyman_category_id:this.joinResultDataSelectedCategories,
      handyman_category_name:name,
      handyman_category_image:image,
      to_be_show_featured_handyman:"no"
    };
    let navigationExtras: NavigationExtras = 
    {
      queryParams: 
      {
        special: JSON.stringify(this.queryString)
      }
    };
    this.client.router.navigate(['/tabs/post-a-job-location'], navigationExtras);
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

}
