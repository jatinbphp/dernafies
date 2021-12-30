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

  constructor(public fb: FormBuilder, public client: ClientService, public menu: MenuController, public loadingCtrl: LoadingController, public modalCtrl: ModalController) 
  { }

  ngOnInit()
  { }

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
      should_menu_enable: false
    });//THIS OBSERVABLE IS USED TO KNOW IS ANY HAS SIGNIN
    //localStorage.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('email');
    localStorage.removeItem('userTypeID');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('role');
    this.client.router.navigate(['sign-in']);
  }

  changeDefaultLanguage(language)
  {
    localStorage.setItem('default_language',language);
    this.client.publishSomeDataOnLanguageChange({
      language_selected: language
    });//THIS OBSERVABLE IS USED TO SET DEFAULT OR SELECTED LANGUAGE
  }
}
