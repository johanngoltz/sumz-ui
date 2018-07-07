import { Inject, Injectable } from '@angular/core';
import { TypedAxiosInstance } from 'restyped-axios';
import { Observable, ReplaySubject, from, of, throwError } from 'rxjs';
import { filter, flatMap, retry, switchMap } from 'rxjs/operators';
import { SumzAPI } from '../api/api';
import { Scenario } from '../api/scenario';
import { HttpClient } from './http-client';

@Injectable({
  providedIn: 'root',
})
export class ScenariosService {
  public scenarios$: Observable<Scenario[]>;
  protected _scenarios$: ReplaySubject<Scenario[]>;
  protected _scenariosStorage: Scenario[];

  constructor(@Inject(HttpClient) private _apiClient: TypedAxiosInstance<SumzAPI>) {
    this._scenarios$ = new ReplaySubject(1);
    this.scenarios$ = this._scenarios$.asObservable();

    this.getScenarios().subscribe();
  }

  getScenarios() {
    return from(this._apiClient.request({ url: '/scenario' })).pipe(
      retry(2),
      flatMap(response => {
        this._scenariosStorage = response.data;
        this._scenarios$.next([...response.data]);
        return this.scenarios$;
      }));
  }

  getScenario(id: number) {
    return this.scenarios$.pipe(
      filter(scenarios => !!scenarios),
      switchMap(scenarios => of(scenarios.find(s => s.id === id))),
      switchMap(scenario => undefined === scenario ? throwError('Szenario existiert nicht') : of(scenario))
    );
  }

  addScenario(scenario: Scenario) {
    return from(this._apiClient.request({
      url: '/scenario',
      data: scenario,
      method: 'POST',
    })).pipe(
      retry(2),
      switchMap(response => {
        this._scenariosStorage.push(response.data);
        this._scenarios$.next([...this._scenariosStorage]);
        return of(response.data);
      })
    );
  }

  updateScenario(scenario: Scenario) {
    return from(this._apiClient.request({
      url: `/scenario/${scenario.id}` as '/scenario/:sId',
      method: 'PUT',
      data: scenario,
    })).pipe(
      retry(2),
      switchMap(response => {
        const updatedScenario = response.data;
        this._scenariosStorage[this._scenariosStorage.indexOf(scenario)] = updatedScenario;
        return of(updatedScenario);
      })
    );
  }

  removeScenario(scenario: Scenario) {
    return from(this._apiClient.delete(`/scenario/${scenario.id}`)).pipe(
      retry(2),
      switchMap(() => {
        this._scenariosStorage.splice(this._scenariosStorage.indexOf(scenario), 1);
        this._scenarios$.next([...this._scenariosStorage]);
        return of(scenario);
      }),
    );
  }
}
