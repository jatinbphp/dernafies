import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SignUpWithPinCompletionPage } from './sign-up-with-pin-completion.page';

describe('SignUpWithPinCompletionPage', () => {
  let component: SignUpWithPinCompletionPage;
  let fixture: ComponentFixture<SignUpWithPinCompletionPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpWithPinCompletionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpWithPinCompletionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
