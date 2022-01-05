import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ClientService } from '../providers/client.service';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";

@Component({
  selector: 'app-handyman-selected',
  templateUrl: './handyman-selected.page.html',
  styleUrls: ['./handyman-selected.page.scss'],
})

export class HandymanSelectedPage implements OnInit 
{
  public id:any='';
  public rtl_or_ltr = '';
  public language_selected = '';
	public default_language_data: any = [];
  public language_key_exchange_array: any = [];
  public queryStringData: any=[];
  public resultDataHandyMan: any=[];
  public is_handy_man_selected:boolean = false;

  constructor(public client: ClientService, public loadingCtrl: LoadingController, private route: ActivatedRoute)
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

  async ionViewWillEnter()
  {
    this.route.queryParams.subscribe(params => 
    {
      if(params && params.special)
      {
        this.queryStringData = JSON.parse(params.special);        
      }
    });
    this.id=this.queryStringData['id'];

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
      id:this.id
    }
    await this.client.getHandymanDetailById(dataHandyMan).then(result => 
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
  }

  backToAllHandyMan()
  {
    this.client.router.navigate(['/tabs/handyman-view-all']);
  }
  showLocation()
  {
    this.client.router.navigate(['/tabs/handyman-send-location']);
  }

  selectHandyMan()
  {
    this.is_handy_man_selected = true;
  }
}
