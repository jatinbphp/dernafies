import { Component } from '@angular/core';
import { ClientService } from './providers/client.service';
import { MenuController, ModalController } from '@ionic/angular';
import { ProfilePage } from './profile/profile.page';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent 
{
  public rtl_or_ltr = '';
  public language_selected = '';
  public default_language_data: any = [];
  public should_menu_enable:boolean = false;
  public role:any='';
  public queryString: any=[];
  public appPages = [
    { title: 'Home', title_for_menu:'Home', url: '/tabs/home', icon: 'home', is_function:0},//[0]
    { title: 'Profile', title_for_menu:'Profile', url: '#', icon: 'person', is_function:1},//[1]
    { title: 'Post a Job', title_for_menu:'Post a Job', url: '#', icon: 'construct', is_function:1},//[2]
    { title: 'Current Requests', title_for_menu:'Current Requests', url: '/tabs/current-requests', icon: 'reorder-four', is_function:0},//[3]    
    { title: 'Past Requests', title_for_menu:'Past Requests', url: '/tabs/past-requests', icon: 'time', is_function:0},//[4]    
    { title: 'Settings', title_for_menu:'Settings', url: '/tabs/settings', icon: 'settings', is_function:0},//[5]    
    { title: 'Logout', title_for_menu:'Logout', url: '#', icon: 'power', is_function:1},//[6]    
  ];
  constructor(public client: ClientService, public modalCtrl: ModalController, public menu: MenuController) 
  {
    this.language_selected = localStorage.getItem('default_language');
    this.client.getObservableOnLanguageChange().subscribe((data) => {
      this.language_selected = data.language_selected;
      this.rtl_or_ltr = (this.language_selected == 'arabic') ? 'rtl' : 'ltr';
      this.InitializeAPP();
      //console.log('Data received', data);
    });//THIS OBSERVABLE IS USED TO SET DEFAULT OR SELECTED LANGUAGE
    this.rtl_or_ltr = (this.language_selected == 'arabic') ? 'rtl' : 'ltr';

    this.client.getObservableOnSignIn().subscribe((data) => {
			this.should_menu_enable = data.should_menu_enable;
      this.role=data.role;
			if(this.should_menu_enable == true)
      {
        this.menu.enable(true);
      }
      if(this.should_menu_enable == false)
      {
        this.menu.enable(false);
      }
      console.log('Data received', data);
		});//THIS OBSERVABLE IS USED TO KNOW IS ANY HAS SIGNIN

    this.InitializeAPP();
  }

  async InitializeAPP()
  {
    let role = (localStorage.getItem('role')) ? localStorage.getItem('role') : undefined;
    if(role!='' && role!='null' && role!=null && role!=undefined && role!='undefined')
    {
      this.role = role;
    }

    if(this.language_selected == null || this.language_selected == undefined || this.language_selected == '')
    {
      this.language_selected = 'english';
    }
    console.log(this.language_selected);
    this.default_language_data = await this.client.getLanguageDefault();
    console.log(this.default_language_data);
    /*
    this.client.publishSomeDataOnLanguageChange({
      language_selected: 'arabic'
    });//THIS OBSERVABLE IS USED TO SET DEFAULT OR SELECTED LANGUAGE
    */
    this.appPages[0].title = this.default_language_data['translation'][0]['menu'][0][this.language_selected][0]['home'];
    this.appPages[1].title = this.default_language_data['translation'][0]['menu'][0][this.language_selected][0]['profile'];
    this.appPages[2].title = this.default_language_data['translation'][0]['menu'][0][this.language_selected][0]['post_a_job'];
    this.appPages[3].title = this.default_language_data['translation'][0]['menu'][0][this.language_selected][0]['current_requests'];
    this.appPages[4].title = this.default_language_data['translation'][0]['menu'][0][this.language_selected][0]['past_requests'];
    this.appPages[5].title = this.default_language_data['translation'][0]['menu'][0][this.language_selected][0]['settings'];
    this.appPages[6].title = this.default_language_data['translation'][0]['menu'][0][this.language_selected][0]['logout'];
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

  PostAJob()
  {
    this.client.router.navigate(['/tabs/post-a-job']);
  }

  Logout()
  {
    this.client.publishSomeDataOnSignIn({
      should_menu_enable: false,
      role:''
    });//THIS OBSERVABLE IS USED TO KNOW IS ANY HAS SIGNIN
    this.role='';
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
}
