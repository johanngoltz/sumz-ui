import { Injectable } from '@angular/core';
import axios, { TypedAxiosInstance } from 'restyped-axios';
import { Scenario } from './project';
import { ScenarioAPI } from './scenario-api';

@Injectable({
  providedIn: 'root',
})
export class ScenariosService {
  protected scenarios: Map<number, Scenario[]> = new Map<number, Scenario[]>();
  private api: TypedAxiosInstance<ScenarioAPI>;

  constructor() {
    this.api = axios.create<ScenarioAPI>({ baseURL: 'http://localhost:8080' });
  }

  async getScenarios(ofProjectId: number): Promise<Scenario[]> {
    const scenarios = (await this.api.get(`/project/${ofProjectId}/scenario`)).data as Scenario[];
    this.scenarios.set(ofProjectId, scenarios);
    return scenarios;
  }

  async addScenario(toProjectId: number, scenario: Scenario): Promise<Scenario> {
    const mergedScenario = (await this.api.post(
      `/project/${toProjectId}/scenario`,
      scenario
    )).data;
    // TODO: handle empty array / adding a scenario to newly-created project
    this.scenarios.get(toProjectId).push(mergedScenario);
    return mergedScenario;
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
