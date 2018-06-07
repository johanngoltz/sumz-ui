import { Project } from './project';

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
            response: Project
        }
    }
}