import { Component } from '@angular/core';
import { ClientService } from './providers/client.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent 
{
  public language_selected = '';
  public default_language_data: any = [];
  public appPages = [
    //{ title: 'Sign In', url: '/sign-in', icon: 'person'},//[0]
    //{ title: 'Sign Up', url: '/sign-up', icon: 'person'},//[0]
    { title: 'Profile', url: '/tabs/profile', icon: 'person', is_function:0},//[0]
    { title: 'Current Requests', url: '/tabs/current-requests', icon: 'reorder-four', is_function:0},//[1]    
    { title: 'Past Requests', url: '/tabs/past-requests', icon: 'time', is_function:0},//[2]    
    { title: 'Settings', url: '/tabs/settings', icon: 'settings', is_function:0},//[3]    
    { title: 'Logout', url: '/tabs/home', icon: 'power', is_function:1},//[4]    
  ];
  constructor(public client: ClientService) 
  {
    this.client.getObservableOnLanguageChange().subscribe((data) => {
      this.language_selected = data.language_selected;
      console.log('Data received', data);
    });//THIS OBSERVABLE IS USED TO SET DEFAULT OR SELECTED LANGUAGE
    this.InitializeAPP();
  }

  async InitializeAPP()
  {
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
    this.appPages[0].title = this.default_language_data['translation'][0]['menu'][0][this.language_selected][0]['profile'];
    this.appPages[1].title = this.default_language_data['translation'][0]['menu'][0][this.language_selected][0]['current_requests'];
    this.appPages[2].title = this.default_language_data['translation'][0]['menu'][0][this.language_selected][0]['past_requests'];
    this.appPages[3].title = this.default_language_data['translation'][0]['menu'][0][this.language_selected][0]['settings'];
    this.appPages[4].title = this.default_language_data['translation'][0]['menu'][0][this.language_selected][0]['logout'];
  }

  Logout()
  {
    localStorage.clear();
    this.client.router.navigate(['sign-in']);
  }
}
