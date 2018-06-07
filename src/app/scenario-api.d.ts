import { Scenario } from './project';

export interface ScenarioAPI {
    '/project/:pId/scenario': {
        params: { pId: number },
        GET: { response: Scenario[] },
        POST: { body: Scenario, response: Scenario }
    },
    '/project/:pId/scenario/:sId': {
        params: { pId: number, sId: number },
        GET: { response: Scenario },
        DELETE: {},
        PATCH: { data: Scenario, response: Scenario }
    }
}