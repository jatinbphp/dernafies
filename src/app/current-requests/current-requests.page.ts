import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-current-requests',
  templateUrl: './current-requests.page.html',
  styleUrls: ['./current-requests.page.scss'],
})
export class CurrentRequestsPage implements OnInit {
  public CurrentRequestList:string='AcceptRequest';
  constructor() { }

  ngOnInit() {
  }

}
