import { Scenario } from './scenario';

export interface ScenarioAPI {
    '/scenario': {
        GET: { response: Scenario[] },
        POST: { body: Scenario, response: Scenario }
    },
    '/scenario/:sId': {
        params: { sId: number },
        GET: { response: Scenario },
        PUT: { body: Scenario, response: Scenario },
        DELETE: {}
    }
}
