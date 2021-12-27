import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss']
})
export class SearchPage {

  constructor() {}
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
        return 1.1;
      case 375 <= innerWidth && innerWidth <= 475:
        return 2.6;
      case 476 <= innerWidth && innerWidth <= 575:
        return 2.6;
      case 576 <= innerWidth && innerWidth <= 700:
        return 1.8;
      case 701 <= innerWidth && innerWidth <= 900:
        return 2.3;
      case 901 <= innerWidth && innerWidth <= 991:
        return 3.3;
      case 992 <= innerWidth && innerWidth <= 1025:
        return 3.3;
      case 1026 <= innerWidth && innerWidth <= 1199:
        return 3.3;
      case 1200 <= innerWidth:
        return 4.3;
    }
  }

}
