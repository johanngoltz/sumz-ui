import { Scenario } from './scenario';

export interface SumzAPI {
    '/oauth/token': {
        POST: {
            body: { },
            response: {
                access_token: string,
                refresh_token: string;
                token_type: string;
                expires_in: number;
                scope: string;
                jti: string;
                id: number;
            },
        }
    },
    '/users': {
        POST: {
            body: {
                email: string,
                password: string
            },
        }
    },
    '/users/:id': {
        PUT: {
            body: {
                passwordold: string,
                passwordnew: string,
                passwordnew2: string
            },
        }
    },
    '/users/:id/delete': {
        params: {id: number},
        POST: {
            body: {
                password: string,
            },
        }
    },
    '/users/forgot': {
        POST: {
            body: {
                email: string
            },
        }
    },
    '/users/reset/token': {
        POST: {
            body: {
                password: string
            },
        }
    },
    '/scenario': {
        GET: { response: Scenario[] },
        POST: { body: Scenario, response: Scenario }
    },
    '/scenario/:sId': {
        params: { sId: number },
        GET: { response: Scenario },
        PUT: { body: Scenario, response: Scenario },
        DELETE: {}
    },
}
