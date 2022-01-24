import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MessagesCustomerHandymanPage } from './messages-customer-handyman.page';

describe('MessagesCustomerHandymanPage', () => {
  let component: MessagesCustomerHandymanPage;
  let fixture: ComponentFixture<MessagesCustomerHandymanPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagesCustomerHandymanPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MessagesCustomerHandymanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
