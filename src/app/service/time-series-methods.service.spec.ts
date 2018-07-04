import { TestBed, inject } from '@angular/core/testing';

import { TimeSeriesMethodsService } from './time-series-methods.service';

describe('TimeSeriesMethodsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimeSeriesMethodsService],
    });
  });

  it('should be created', inject([TimeSeriesMethodsService], (service: TimeSeriesMethodsService) => {
    expect(service).toBeTruthy();
  }));
});
