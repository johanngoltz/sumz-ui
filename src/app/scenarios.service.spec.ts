import { TestBed, inject } from '@angular/core/testing';

import { ScenariosService } from './scenarios.service';
import { Scenario } from './project';

describe('ScenariosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScenariosService],
    });
  });

  it('should be created', inject([ScenariosService], (service: ScenariosService) => {
    expect(service).toBeTruthy();
  }));

  it('should load a projects\' scenarios', inject([ScenariosService], async (service: ScenariosService) => {
    const receivedScenarios = await service.getScenarios(200);
    expect(receivedScenarios.length).toBe(2);
  }));

  it('should throw an exception on 404', inject([ScenariosService], async (service: ScenariosService) => {
    service.getScenarios(55555555555).then(
      () => fail('expectected call to be rejected'),
      () => expect());
  }));

  it('should add a scenario to a project and return it', inject([ScenariosService], async (service: ScenariosService) => {
    const addedScenario = await service.addScenario(300, new Scenario());
    expect(addedScenario.id).toBeDefined();
  }));

  // TODO: more tests
});
