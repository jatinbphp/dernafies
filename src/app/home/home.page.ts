import { Component } from '@angular/core';
import { MenuController, LoadingController, ModalController } from '@ionic/angular';
import { ClientService } from '../providers/client.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfilePage } from '../profile/profile.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class HomePage 
{
  public id:any = '';
  public role:any = '';
  public welcome_text:any = '';
  public greetings:any = '';
  constructor(public fb: FormBuilder, public client: ClientService, public menu: MenuController, public loadingCtrl: LoadingController, public modalCtrl: ModalController) 
  {}

  async ionViewWillEnter()
  {
    this.id=localStorage.getItem('id');
    this.role=localStorage.getItem('role');
    
    if(this.id!='' && this.id!=null && this.id!=undefined && this.id!='null' && this.id!='undefined')
    {
      let today = new Date()
      let curHr = today.getHours()
      if(curHr < 12)
      {
        this.greetings='Good Morning';
      }
      else if (curHr < 18) 
      {
        this.greetings='Good Afternoon';
      }
      else
      {
        this.greetings='Good Evening';
      }
      let firstName = (localStorage.getItem('firstName')) ? localStorage.getItem('firstName') : "";
      let lastName = (localStorage.getItem('lastName')) ? localStorage.getItem('lastName') : "";
      this.welcome_text = 'Hi, '+firstName+' '+lastName;      
    }
  }

  categorieSlide = {
    // slidesPerView: 1.3,
    initialSlide: 1,
    slidesPerView: this.categoriecheckScreen(),
    speed: 600,
  };
  
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

  showHandyMan()
  {
    this.client.router.navigate(['/tabs/handyman-selected']);
  }
}
