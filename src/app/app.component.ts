import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Sign In', url: '/sign-in', icon: 'person'},//[0]
    { title: 'Sign Up', url: '/sign-up', icon: 'person'},//[0]
    { title: 'Profile', url: '/tabs/home', icon: 'person'},//[0]
    { title: 'Current Requests', url: '/tabs/home', icon: 'reorder-four'},//[1]    
    { title: 'Past Requests', url: '/tabs/home', icon: 'time'},//[2]    
    { title: 'Settings', url: '/tabs/home', icon: 'settings'},//[3]    
    { title: 'Logout', url: '/tabs/home', icon: 'power'},//[4]    
  ];
  constructor() {}
}
