import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SensexService } from './sensex.service';

describe('SensexService', () => {
  let service: SensexService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SensexService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(SensexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

