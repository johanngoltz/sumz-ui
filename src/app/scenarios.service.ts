import { Injectable } from '@angular/core';
import axios, { TypedAxiosInstance } from 'restyped-axios';
import { BehaviorSubject, Observable } from 'rxjs';
import { Scenario } from './project';
import { ScenarioAPI } from './scenario-api';

@Injectable({
  providedIn: 'root',
})

export class ScenariosService {
  public scenarios$: Observable<Map<number, Scenario[]>>;

  protected scenarios: Map<number, Scenario[]> = new Map<number, Scenario[]>();

  private scenariosStorage: Map<number, Scenario[]> = new Map<number, Scenario[]>();
  private _scenarios$: BehaviorSubject<Map<number, Scenario[]>> = new BehaviorSubject(this.scenariosStorage);
  private api: TypedAxiosInstance<ScenarioAPI>;

  constructor() {
    this.api = axios.create<ScenarioAPI>({ baseURL: 'http://localhost:8080' });
    this.scenarios$ = this._scenarios$.asObservable();
  }

  async getScenarios(ofProjectId: number) {
    const scenarios = (await this.api.get(`project/${ofProjectId}/scenario`)).data as Scenario[];
    this.scenariosStorage.set(ofProjectId, scenarios);
    this._scenarios$.subscribe(next =>
      console.log(next));
    this._scenarios$.next(new Map(this.scenariosStorage));
  }

  async addScenario(toProjectId: number, scenario: Scenario) {
    const mergedScenario = (await this.api.post(
      `/project/${toProjectId}/scenario`,
      scenario
    )).data;
    if (!this.scenariosStorage.has(toProjectId)) {
      this.scenariosStorage.set(toProjectId, [mergedScenario]);
    } else {
      this.scenariosStorage.get(toProjectId).push(mergedScenario);
    }
    this._scenarios$.next(Object.assign({}, this.scenariosStorage));
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
