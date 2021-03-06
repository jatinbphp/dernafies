import { Component, OnInit } from '@angular/core';
import { MenuController, LoadingController, ModalController } from '@ionic/angular';
import { ClientService } from '../providers/client.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfilePage } from '../profile/profile.page';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})

export class SettingsPage implements OnInit 
{
  public rtl_or_ltr = '';
  public language_selected = '';
	public default_language_data: any = [];
  public language_key_exchange_array: any = [];
  public id:any = '';
  public role:any = '';

  constructor(public fb: FormBuilder, public client: ClientService, public menu: MenuController, public loadingCtrl: LoadingController, public modalCtrl: ModalController) 
  { 
    this.client.getObservableOnLanguageChange().subscribe((data) => {
			this.language_selected = data.language_selected;
			this.rtl_or_ltr = (this.language_selected == 'arabic') ? 'rtl' : 'ltr';
			console.log('Data received', data);
		});//THIS OBSERVABLE IS USED TO SET DEFAULT OR SELECTED LANGUAGE
  }

  ngOnInit()
  { 
    this.default_language_data = this.client.default_language_data;
		this.language_selected = this.client.language_selected;
		this.rtl_or_ltr = (this.language_selected == 'arabic') ? 'rtl' : 'ltr';
    
    this.language_key_exchange_array['english']='categoryName';
    this.language_key_exchange_array['arabic']='categoryNameArabic';
    this.language_key_exchange_array['kurdish']='categoryNameKurdi';

    this.id=localStorage.getItem('id');
    this.role = localStorage.getItem('role');
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

  Logout()
  {
    this.client.publishSomeDataOnSignIn({
      should_menu_enable: false,
      role:''
    });//THIS OBSERVABLE IS USED TO KNOW IS ANY HAS SIGNIN
    //localStorage.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('email');
    localStorage.removeItem('userTypeID');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('role');
    localStorage.removeItem('job');
    localStorage.removeItem('post-a-job');
    localStorage.removeItem('search_for_handyman');
    localStorage.removeItem('way_to_select_handyman');
    this.client.router.navigate(['sign-in']);
  }

  async changeDefaultLanguage(language)
  {
    localStorage.setItem('default_language',language);
    this.client.publishSomeDataOnLanguageChange({
      language_selected: language
    });//THIS OBSERVABLE IS USED TO SET DEFAULT OR SELECTED LANGUAGE

    //update language option
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
    let user_id = (localStorage.getItem('id')) ? localStorage.getItem('id') : 0;
    let language_to_update = "";
    if(language == 'arabic')
    {
      language_to_update='Arabic';
    }
    if(language == 'kurdish')
    {
      language_to_update='Kurdi';
    }
    if(language == 'english')
    {
      language_to_update='English';
    }

    let data=
		{
      user_id:user_id,
      language:language_to_update
    }
    await this.client.updateLanguage(data).then(result => 
    {	
      loading.dismiss();//DISMISS LOADER			
      this.ngOnInit();
            
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });
  }

  async updateDefaultCurrency(currency_code)
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
    let user_id = (localStorage.getItem('id')) ? localStorage.getItem('id') : 0;
    let data=
		{
      user_id:user_id,
      currency_code:currency_code
    }
    await this.client.updateDefaultCurrency(data).then(result => 
    {	
      loading.dismiss();//DISMISS LOADER			
      this.ngOnInit();
            
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });
  }
}
