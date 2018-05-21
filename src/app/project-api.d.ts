<<<<<<< HEAD
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
    year: number;
    externalCapital: number;
    fcf: number;
}
=======
import { Project } from './project';
>>>>>>> origin/master

declare class Success {
    success: boolean;
}

export interface ProjectAPI {
    '/project': {
        GET: {
            response: Project[]
        },
        POST: {
            body: Project,
            response: Success
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
            response: Success
        },
        PATCH: {
            data: Project,
            response: Success
        }
    }
}