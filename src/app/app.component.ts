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
    { title: 'Profile', url: '/tabs/profile', icon: 'person'},//[0]
    { title: 'Current Requests', url: '/tabs/current-requests', icon: 'reorder-four'},//[1]    
    { title: 'Past Requests', url: '/tabs/past-requests', icon: 'time'},//[2]    
    { title: 'Settings', url: '/tabs/settings', icon: 'settings'},//[3]    
    { title: 'Logout', url: '/tabs/home', icon: 'power'},//[4]    
  ];
  constructor() {}
}
