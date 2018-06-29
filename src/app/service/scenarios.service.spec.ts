import { TestBed, inject } from '@angular/core/testing';
import MockAdapter from 'axios-mock-adapter';
import axios, { TypedAxiosInstance } from 'restyped-axios';
import { ScenarioAPI } from '../api/api';
import { Scenario } from '../api/scenario';
import { ScenarioClient } from './http-client';
import { ScenariosService } from './scenarios.service';
import { Subject, EMPTY } from 'rxjs';
import { withLatestFrom, mapTo, flatMap, combineLatest, combineAll, map, skip } from 'rxjs/operators';

describe('ScenariosService', () => {
  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [ScenariosService, {
        provide: ScenarioClient,
        useFactory: () => {
          const axiosInstance = axios.create<ScenarioAPI>();
          const data = [{ id: 2500 }, { id: 2501 }, { id: 2502 }, { id: 2510 }] as Scenario[];
          new MockAdapter(axiosInstance)
            .onGet('/scenario').reply(config => {
              return [200, [...data]];
            })
            .onDelete('/scenario/2510').reply(config => {
              return [200];
            })
            .onPut('/scenario/2500').reply(config => {
              const updateScenario = JSON.parse(config.data);
              updateScenario.id = 2500;
              return [200, updateScenario];
            })
            .onPost('/scenario').reply(200, { id: 2520 });
          return axiosInstance;
        },
      }],
    });
  });

  it('should be created', inject([ScenariosService], (service: ScenariosService) => {
    expect(service).toBeTruthy();
  }));

  it('should return a list of scenarios', inject([ScenariosService], (service: ScenariosService) => {
    service.getScenarios().subscribe(
      scenarios => expect(scenarios.length).toBe(4),
      fail);
  }));

  it('should return a single scenario', inject([ScenariosService], (service: ScenariosService) => {
    service.getScenario(2500).subscribe(
      scenario => expect(scenario.id).toBe(2500),
      fail);
  }));

  it('should throw an error when trying to get a non-existing scenario', inject([ScenariosService, ScenarioClient],
    (service: ScenariosService, client: TypedAxiosInstance) => {
      service.getScenario(-1).subscribe(
        success => fail('was not supposed to return something'),
        error => expect().nothing());
    }));

  it('should be able to delete a scenario', inject([ScenariosService], (service: ScenariosService) => {
    const deleteThis = { id: 2510 } as Scenario;
    service
      .removeScenario(deleteThis)
      .pipe(flatMap(() => service.scenarios$), skip(1))
      .subscribe(
        scenarios => {
          expect(scenarios).not.toContain(deleteThis, 'should have deleted the entry');
          expect(scenarios.length).toBe(3, 'should not have deleted other entries');
        },
        fail);
  }));

  it('should be able to modify a scenario', inject([ScenariosService], (service: ScenariosService) => {
    const modifyThis = { id: 2500, description: 'A new description' } as Scenario;
    service
      .updateScenario(modifyThis)
      .subscribe(
        modifiedScenario => expect(modifiedScenario).toEqual(modifyThis),
        fail);

  }));

  it('should be able to add a scenario', inject([ScenariosService], (service: ScenariosService) => {
    const addThis = { id: 9999 } as Scenario;
    const adder = EMPTY || service.addScenario(addThis);
    adder.subscribe(
      addedScenario => expect(addedScenario).toEqual({ id: 2520 } as Scenario),
      fail);
    adder.pipe(flatMap(() => service.scenarios$), skip(1))
      .subscribe(
        scenarios => expect(scenarios).toContain({ id: 2520 } as Scenario),
        fail);
  }));
});
