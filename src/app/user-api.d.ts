// definition of communication-structure (see API documentation)
export interface UserAPI {
    '/oauth/token': {
        POST: {
            body: { },
            respose: {
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
    '/users/id': {
        PUT: {
            body: {
                passwordold: string,
                passwordnew: string,
                passwordnew2: string
            },
        }
    },
    'TODO nachdem die definiert haben': {
        PUT: {
            body: {
                passwordnew: string,
                passwordnew2: string
            },
        }
    },

}
