import { TestBed } from '@angular/core/testing';

import { UpdateUrlService } from './update-url.service';

describe('UpdateUrlService', () => {
  let service: UpdateUrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateUrlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
