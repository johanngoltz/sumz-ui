import { Injectable } from '@angular/core';
import axios, { TypedAxiosInstance } from 'restyped-axios';
import { BehaviorSubject, Observable, of, from } from 'rxjs';
import { Scenario } from './project';
import { ScenarioAPI } from './scenario-api';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class ScenariosService {
  public scenarios$: Observable<Map<number, Scenario[]>>;

  protected scenarios: Map<number, Scenario[]> = new Map<number, Scenario[]>();

  private _scenariosStorage: Map<number, Scenario[]> = new Map<number, Scenario[]>();
  private _scenarios$: BehaviorSubject<Map<number, Scenario[]>> = new BehaviorSubject(this._scenariosStorage);
  private api: TypedAxiosInstance<ScenarioAPI>;

  constructor() {
    this.api = axios.create<ScenarioAPI>({ baseURL: 'http://localhost:8080' });
    this.scenarios$ = this._scenarios$.asObservable();
    this.scenarios$.subscribe(next =>
      console.log(next));
  }

  async getScenarios(ofProjectId: number): Promise<Observable<Scenario[]>> {
    const scenarios = (await this.api.get(`project/${ofProjectId}/scenario`)).data as Scenario[];
    this._scenariosStorage.set(ofProjectId, scenarios);
    this._scenarios$.next(new Map(this._scenariosStorage));
    return this.scenarios$.pipe(
      switchMap(s => of(s.get(ofProjectId)))
    );
  }

  async getScenario(ofProjectId: number, scenarioId: number) {
    if (!this._scenariosStorage.has(ofProjectId)) {
      await this.getScenarios(ofProjectId);
    }
    return this.scenarios$;
  }

  async addScenario(toProjectId: number, scenario: Scenario) {
    const response = (await this.api.post(
      `/project/${toProjectId}/scenario`,
      scenario
    ));
    if (response.status === 200) {
      if (!this._scenariosStorage.has(toProjectId)) {
        this._scenariosStorage.set(toProjectId, [response.data]);
      } else {
        this._scenariosStorage.get(toProjectId).push(response.data);
      }
      this._scenarios$.next(new Map(this._scenariosStorage));
      return this.scenarios$.pipe(
        switchMap(scenarios => of(
          scenarios.get(toProjectId).find(s => s.id === response.data.id)
        ))
      );
    } else {
      throw response;
    }
    // TODO: handle empty array / adding a scenario to newly-created project
  }

  async updateScenario(ofProjectId: number, scenario: Scenario) {
    await this.api.patch(
      `/project/${ofProjectId}/scenario/${scenario.id}`,
      scenario
    );
    const scenarioCache = this.scenarios.get(ofProjectId);
    scenarioCache[scenarioCache.findIndex(value => value.id === scenario.id)] = scenario;
  }

  async removeScenario(ofProjectId: number, scenario: Scenario) {
    await this.api.delete(
      `/project/${ofProjectId}/scenario/${scenario.id}`
    );
    const scenarioCache = this.scenarios.get(ofProjectId);
    scenarioCache.splice(scenarioCache.indexOf(scenario), 1);
  }
}
