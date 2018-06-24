import { Inject, Injectable } from '@angular/core';
import { TypedAxiosInstance } from 'restyped-axios';
import { BehaviorSubject, Observable, empty, from, of, throwError } from 'rxjs';
import { filter, retry, switchMap } from 'rxjs/operators';
import { ScenarioAPI } from '../api/api';
import { Scenario } from '../api/scenario';
import { AxiosInstance } from './http-client';

@Injectable({
  providedIn: 'root',
})
export class ScenariosService {
  public scenarios$: Observable<Scenario[]>;
  private _scenarios$: BehaviorSubject<Scenario[]>;
  private _scenariosStorage: Scenario[];

  constructor(@Inject(AxiosInstance) private _apiClient: TypedAxiosInstance<ScenarioAPI>) {
    this._scenarios$ = new BehaviorSubject(undefined);
    this.scenarios$ = this._scenarios$.asObservable();

    this.getScenarios();
  }

  getScenarios() {
    return from(this._apiClient.request({ url: '/scenario' })).pipe(
      // TODO: wird vllt nicht wie gedacht funktionieren
      switchMap(response => response.status === 200 ?
        of(response) :
        throwError(response)
      ),
      retry(2),
      switchMap(response => {
        this._scenariosStorage = response.data;
        this._scenarios$.next([...response.data]);
        return this.scenarios$;
      })
    );
  }

  getScenario(id: number) {
    // TODO: Maybe Error Handling
    this.getScenarios();
    return this.scenarios$.pipe(
      filter(scenarios => !!scenarios),
      switchMap(scenarios => of(scenarios.find(s => s.id === id)))
    );
  }

  addScenario(scenario: Scenario) {
    return from(this._apiClient.request({
      url: '/scenario',
      data: scenario,
      method: 'POST',
    })).pipe(
      switchMap(response => response.status === 201 ? of(response) : throwError(response)),
      retry(2),
      switchMap(response => {
        this._scenariosStorage.push(response.data);
        this._scenarios$.next([...this._scenariosStorage]);
        return of(response.data);
      })
    );
  }

  updateScenario(scenario: Scenario) {
    return throwError('Not implemented');
  }

  removeScenario(scenario: Scenario) {
    return from(this._apiClient.delete(`/scenario/${scenario.id}`)).pipe(
      switchMap(response => {
        this._scenariosStorage.splice(this._scenariosStorage.indexOf(scenario), 1);
        this._scenarios$.next([...this._scenariosStorage]);
        return empty();
      })
    );
  }

  private ensureStatus(allowStatus: number) {
    return (response: { status: number }) =>
      response.status === allowStatus ?
        of(response) :
        throwError(response);
  }
}
