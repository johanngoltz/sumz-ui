// definition of communication-structure (see API documentation)
export interface UserAPI {
    '/oauth/token': {
        POST: {
            body: {
                email: string, 
                password: string, 
                grant_type: string
            },
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
}
