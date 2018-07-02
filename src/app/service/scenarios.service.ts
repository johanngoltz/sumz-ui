import { Inject, Injectable } from '@angular/core';
import { TypedAxiosInstance } from 'restyped-axios';
import { EMPTY, from, interval, NEVER, Observable, of, race, ReplaySubject, throwError } from 'rxjs';
import { filter, flatMap, retry, switchMap, switchMapTo, tap } from 'rxjs/operators';
import { ScenarioAPI } from '../api/api';
import { Scenario } from '../api/scenario';
import { ScenarioClient } from './http-client';

@Injectable({
  providedIn: 'root',
})
export class ScenariosService {
  public scenarios$: Observable<Scenario[]>;
  protected _scenarios$: ReplaySubject<Scenario[]>;
  protected _scenariosStorage: Scenario[];

  private _getScenariosInterval$: Observable<number> = NEVER;

  constructor(@Inject(ScenarioClient) private _apiClient: TypedAxiosInstance<ScenarioAPI>) {
    this._scenarios$ = new ReplaySubject();
    this.scenarios$ = this._scenarios$.asObservable();

    this.getScenarios().subscribe();
  }

  getScenarios() {
    const getFromBackend = from(this._apiClient.request({ url: '/scenario' })).pipe(
      switchMap(response => response.status === 200 ?
        of(response) :
        throwError(response)
      ),
      retry(2)
    );
    getFromBackend.subscribe(() => this._getScenariosInterval$ = interval(5000));
    return race(
      this._getScenariosInterval$,
      getFromBackend.pipe(
        flatMap(response => {
          console.log('Receiving data');
          this._scenariosStorage = response.data;
          this._scenarios$.next([...response.data]);
          return EMPTY;
        }),
      ))
      .pipe(switchMapTo(this.scenarios$));
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
      // auf flatMap ändern
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
    return from(this._apiClient.put(`/scenario/${scenario.id}`, scenario)).pipe(
      // auf flatMap ändern
      switchMap(response => response.status === 200 ? of(response) : throwError(response)),
      retry(2),
      switchMap(response => {
        const updatedScenario = response.data as Scenario;
        this._scenariosStorage[this._scenariosStorage.indexOf(scenario)] = updatedScenario;
        return of(updatedScenario);
      })
    );
  }

  removeScenario(scenario: Scenario) {
    // auf flatMap ändern
    return from(this._apiClient.delete(`/scenario/${scenario.id}`)).pipe(
      switchMap(response => response.status === 200 ? of(response) : throwError(response)),
      retry(2),
      switchMap(response => {
        this._scenariosStorage.splice(this._scenariosStorage.indexOf(scenario), 1);
        this._scenarios$.next([...this._scenariosStorage]);
        return of(scenario);
      }),
    );
  }
}
