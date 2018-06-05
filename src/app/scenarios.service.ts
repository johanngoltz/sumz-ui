import { Injectable } from '@angular/core';
import { Scenario, Project } from './project';
import { ScenarioAPI } from './scenario-api';
import axios, { TypedAxiosInstance } from 'restyped-axios';

@Injectable({
  providedIn: 'root',
})
export class ScenariosService {
  protected scenarios: Map<number, Scenario[]> = new Map<number, Scenario[]>();
  private api: TypedAxiosInstance<ScenarioAPI>;

  constructor() {
    this.api = axios.create<ScenarioAPI>({ baseURL: 'http://localhost:8080' });
  }

  public async getScenarios(ofProjectId: number): Promise<Scenario[]> {
    const scenarios = (await this.api.get(`/project/${ofProjectId}/scenario`)).data as Scenario[];
    this.scenarios.set(ofProjectId, scenarios);
    return scenarios;
  }

  public async addScenario(toProjectId: number, scenario: Scenario): Promise<Scenario> {
    const mergedScenario = (await this.api.post(
      `/project/${toProjectId}/scenario`,
      scenario
    )).data;
    // TODO: handle empty array / adding a scenario to newly-created project
    this.scenarios.get(toProjectId).push(mergedScenario);
    return mergedScenario;
  }

  public async updateScenario(ofProjectId: number, scenario: Scenario) {
    await this.api.patch(
      `/project/${ofProjectId}/scenario/${scenario.id}`,
      scenario
    );
    const scenarioCache = this.scenarios.get(ofProjectId);
    scenarioCache[scenarioCache.findIndex(value => value.id === scenario.id)] = scenario;
  }

  public async removeScenario(ofProjectId: number, scenario: Scenario) {
    await this.api.delete(
      `/project/${ofProjectId}/scenario/${scenario.id}`
    );
    const scenarioCache = this.scenarios.get(ofProjectId);
    scenarioCache.splice(scenarioCache.indexOf(scenario), 1);
  }
}
