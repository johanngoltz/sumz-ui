import { TestBed, inject } from '@angular/core/testing';
import { Scenario } from './project';
import { ScenariosService } from './scenarios.service';


let spyMethods;
describe('ScenariosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScenariosService],
    });
    spyMethods = {
      nextHandler: next => undefined,
    };
    spyOn(spyMethods, 'nextHandler');
  });

  it('should be created', inject([ScenariosService], (service: ScenariosService) => {
    expect(service).toBeTruthy();
  }));

  it('should load a projects\' scenarios', inject([ScenariosService], async (service: ScenariosService) => {
    (await service.getScenarios(300)).subscribe(spyMethods.nextHandler);
    expect(spyMethods.nextHandler).toHaveBeenCalled();
  }));

  it('should throw an exception on 404', inject([ScenariosService], async (service: ScenariosService) => {
    expect(async () =>
      (await service.getScenarios(55555555555)).subscribe(spyMethods.nextHandler)
    ).toThrow();
    expect(spyMethods.nextHandler).toHaveBeenCalledTimes(0);
  }));

  // TODO: more tests
});
