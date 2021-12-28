import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-past-requests',
  templateUrl: './past-requests.page.html',
  styleUrls: ['./past-requests.page.scss'],
})
export class PastRequestsPage implements OnInit {

	public show_in_view: any = 'list';

	constructor() { }

	ngOnInit() {
	}

	showGridView() {
	    this.show_in_view='grid';
	}

	showListView() {
		this.show_in_view='list';
	}

}
