import { Inject, Injectable } from '@angular/core';
import { TypedAxiosInstance } from 'restyped-axios';
import { Observable, ReplaySubject, from, of, throwError } from 'rxjs';
import { filter, flatMap, retry, switchMap, withLatestFrom } from 'rxjs/operators';
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
    return from(this._apiClient.request({ url: '/scenarios' })).pipe(
      retry(2),
      flatMap(response => {
        this._scenariosStorage = response.data;
        this._scenarios$.next([...response.data]);
        return this.scenarios$;
      }));
  }

  getScenario(id$: Observable<number> | number) {
    // TODO: alle Verwendungen dieser Methode auf Observable<number> ändern
    if (typeof (id$) === 'number') {
      id$ = of(id$);
    }

    return id$.pipe(
      // TODO: funktioniert nicht, wenn der Aufruf von einer Komponente erfolgt, ohne, dass sich die Route geändert hätte
      withLatestFrom(this.scenarios$),
      filter(([scenarioId, scenarios]) => !!scenarios),
      switchMap(([scenarioId, scenarios]) => {
        const scenario = scenarios.find(s => s.id === scenarioId);
        if (scenario) {
          return of(scenario);
        } else {
          return throwError(`Szenario ${scenarioId} existiert nicht`);
        }
      })
    );
  }

  addScenario(scenario: Scenario) {
    return from(this._apiClient.request({
      url: '/scenarios',
      data: scenario,
      method: 'POST',
    })).pipe(
      retry(2),
      switchMap(response => this._forceGetScenario(response.data)),
      switchMap(addedScenario => {
        this._scenariosStorage.push(addedScenario);
        this._scenarios$.next([...this._scenariosStorage]);
        return of(addedScenario);
      })
    );
  }

  updateScenario(scenario: Scenario) {
    return from(this._apiClient.request({
      url: `/scenarios/${scenario.id}` as '/scenarios/:sId',
      method: 'PUT',
      data: scenario,
    })).pipe(
      retry(2),
      switchMap(response => this._forceGetScenario(response.data)),
      flatMap(updatedScenario => {
        this._scenariosStorage.splice(this._scenariosStorage.indexOf(scenario), 1);
        this._scenariosStorage.push(updatedScenario);
        this._scenarios$.next([...this._scenariosStorage]);
        return of(updatedScenario);
      })
    );
  }

  removeScenario(scenario: Scenario) {
    return from(this._apiClient.delete(`/scenarios/${scenario.id}`)).pipe(
      retry(2),
      flatMap(() => {
        this._scenariosStorage.splice(this._scenariosStorage.indexOf(scenario), 1);
        this._scenarios$.next([...this._scenariosStorage]);
        return of(scenario);
      }),
    );
  }

  private _forceGetScenario(id: number) {
    return from(this._apiClient.request({
      url: `/scenarios/${id}` as '/scenarios/:sId',
    })).pipe(
      retry(2),
      switchMap(response => of(response.data))
    );
  }
}
