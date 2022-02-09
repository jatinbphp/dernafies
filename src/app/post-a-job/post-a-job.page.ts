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

  public resultDataCategoriesResponse: any = [];
  public resultDataCategories: any = [];
  public language_key_exchange_array: any = [];
  public queryString: any=[];
  public resultDataSelectedCategories: any = [];
  public resultSelectedCategoriesData: any = [];
  public joinResultDataSelectedCategories:any = '';
  public category_to_be_selected_limit:number=0;
  public category_have_been_selected:number=0;

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
      this.resultDataCategoriesResponse=result;
      this.resultDataCategories=this.resultDataCategoriesResponse['data'];
      this.category_to_be_selected_limit=this.resultDataCategoriesResponse['selection_limit'];
      console.log(this.resultDataCategories);
            
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });//CATEGORIES
  }

  async ionViewWillEnter()
  {
    this.resultDataSelectedCategories=[];
    this.resultSelectedCategoriesData=[];
    this.joinResultDataSelectedCategories='';
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
      this.category_have_been_selected=this.category_have_been_selected+1;
    }
    if(ev.detail.checked == false)
    {
      this.resultDataSelectedCategories=this.removeUnCheckedCategories(this.resultDataSelectedCategories,ev.detail.value);
      this.category_have_been_selected=this.category_have_been_selected-1;
    }
    this.joinResultDataSelectedCategories=this.resultDataSelectedCategories.join(",");
    console.log(this.category_have_been_selected+"@"+this.category_to_be_selected_limit);
    if(this.category_have_been_selected > this.category_to_be_selected_limit)
    {
      this.client.showMessage("Maximum 2 can be selected!");
      console.log(ev);
    }
  }

  postJobForCategory()
  {
    //DATA OF SELECTED CATEGORY
    if(this.resultDataSelectedCategories.length > 0)
    {
      for(let c = 0; c < this.resultDataCategories.length; c ++)
      {
        for(let ci = 0; ci < this.resultDataSelectedCategories.length; ci ++)
        {
          if(this.resultDataSelectedCategories[ci] == this.resultDataCategories[c].id)
          {
            
            let categoryDataObject = 
            {
              handyman_category_name:this.resultDataCategories[c][this.language_key_exchange_array[this.language_selected]],
              handyman_category_image:this.resultDataCategories[c]['categoryImage']
            }
            this.resultSelectedCategoriesData.push(categoryDataObject);
          }
        }
      }
    }
    //DATA OF SELECTED CATEGORY
    this.queryString = 
    {
      handyman_category_id:this.joinResultDataSelectedCategories,
      handyman_category_data:JSON.stringify(this.resultSelectedCategoriesData),
      to_be_show_featured_handyman:"no"
    };
    localStorage.setItem('post-a-job',JSON.stringify(this.queryString));
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
