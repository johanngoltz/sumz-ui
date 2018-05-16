export class Project {
    id: number;
    name: string;
    description: string;
    iterations: number;
    baseYear: number;
    prognosisLength: number;
    deterministic: boolean;
    algorithm: string;
    timeSeries: FinancialData[];
}

export class FinancialData {
    projectId: number;
    year: number;
    externalCapital: number;
    fcf: number;
}

export class Scenario {
    id: number;
    projectId: number;
    equityInterest: number;
    outsideCapitalInterest: number;
    businessTax: number;
    result: object;
}


export interface ProjectAPI {
    '/project': {
        GET: {
            response: Project[]
        },
        POST: {
            body: Project,
            response: {
                status: 'ok' | 'notok'
            }
        }
    },
    '/project/:id': {
        GET: {
            response: Project
        },
        DELETE: {
            params: {
                id: number
            },
            response: {
                success: boolean
            }
        }
    }
}