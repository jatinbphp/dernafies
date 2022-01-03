import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ClientService } from '../providers/client.service';

@Component({
  selector: 'app-handyman-selected',
  templateUrl: './handyman-selected.page.html',
  styleUrls: ['./handyman-selected.page.scss'],
})

export class HandymanSelectedPage implements OnInit 
{
  public rtl_or_ltr = '';
  public language_selected = '';
	public default_language_data: any = [];
  public language_key_exchange_array: any = [];

  constructor(public client: ClientService, public loadingCtrl: LoadingController)
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
  }

  backToAllHandyMan()
  {
    this.client.router.navigate(['/tabs/handyman-view-all']);
  }
  showLocation()
  {
    this.client.router.navigate(['/tabs/handyman-send-location']);
  }

}
