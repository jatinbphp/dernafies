import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-handyman-view-all',
  templateUrl: './handyman-view-all.page.html',
  styleUrls: ['./handyman-view-all.page.scss'],
})
export class HandymanViewAllPage implements OnInit {

  constructor() { }

  handymanSlide = {
    // slidesPerView: 1.3,
    initialSlide: 1,
    //slidesPerView: this.handymancheckScreen(),
    speed: 600,
  };

  ngOnInit() {
  }

}
