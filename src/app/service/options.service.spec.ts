import { TestBed, inject } from '@angular/core/testing';

import { OptionsService } from './options.service';
import { RemoteConfig } from '../api/config';
import { skip } from 'rxjs/operators';

describe('OptionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OptionsService],
    });
  });

  it('should be created', inject([OptionsService], (service: OptionsService) => {
    expect(service).toBeTruthy();
  }));

  it('should return the remote configuration', inject([OptionsService], (service: OptionsService) => {
    service.getConfig().subscribe(config => {
      expect(config).toBeTruthy();
      expect(config.showResult).toBeDefined();
      expect(config.showResult.fte).toBeDefined();
    }, fail);
  }));

  it('should return the remote configuration', inject([OptionsService], (service: OptionsService) => {
    const newConfig: RemoteConfig = {
      showResult: {
        apv: true, fte: false, cvd: true, fcf: true,
      },
    };
    service.getConfig().subscribe();
    service.setConfig(newConfig).pipe(skip(1)).subscribe(updatedConfig => {
      expect(updatedConfig).toEqual(newConfig);
    }, fail);
  }));
});
