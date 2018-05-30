import { Injectable } from '@angular/core';
import { Scenario, Project } from './project';
import { ScenarioAPI } from './scenario-api';
import axios, { TypedAxiosInstance } from 'restyped-axios';

@Injectable({
  providedIn: 'root',
})
export class ScenariosService {
  protected scenarios: Map<number, Scenario[]>;
  private api: TypedAxiosInstance<ScenarioAPI>;

  constructor() {
    this.api = axios.create<ScenarioAPI>({ baseURL: 'http://localhost:8080' });
  }

  async getScenarios(ofProjectId: number): Promise<Scenario[]> {
    return (await this.api.get(`/project/${ofProjectId}`)).data as Scenario[];
  }

  async addScenario(toProjectId: number, scenario: Scenario): Promise<Scenario> {
    const mergedScenario = (await this.api.request({
      url: '/project/:pId/scenario',
      method: 'POST',
      data: scenario,
    })).data;
    // TODO: handle empty array / adding a scenario to newly-created project
    this.scenarios.get(toProjectId).push(mergedScenario);
    return mergedScenario;
  }

  async updateScenario(ofProjectId: number, scenario: Scenario) {
    await this.api.request({
      url: '/project/:pId/scenario/:sId',
      method: 'PATCH',
      data: scenario,
    });
    const scenarioCache = this.scenarios.get(ofProjectId);
    scenarioCache[scenarioCache.findIndex(value => value.id === scenario.id)] = scenario;
  }

  async removeScenario(ofProjectId: number, scenario: Scenario) {
    await this.api.request({
      url: '/project/:pId/scenario/:sId',
      method: 'DELETE',
    });
    const scenarioCache = this.scenarios.get(ofProjectId);
    scenarioCache.splice(scenarioCache.indexOf(scenario), 1);
  }
}
