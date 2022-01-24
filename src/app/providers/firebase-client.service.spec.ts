import { TestBed } from '@angular/core/testing';

import { FirebaseClientService } from './firebase-client.service';

describe('FirebaseClientService', () => {
  let service: FirebaseClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
