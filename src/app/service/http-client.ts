import { InjectionToken } from '@angular/core';
import axios from 'restyped-axios';
import { SumzAPI } from '../api/api';
import { environment } from '../../environments/environment';

// TODO: Ist das Best Practice?
export const HttpClient = new InjectionToken(
    'TypedAxiosInstance', {
        providedIn: 'root',
        factory: () => axios.create<SumzAPI>({
            baseURL: environment.production ? 'http://sumz1718.dh-karlsruhe.de:8080' : 'http://localhost:8080',
        }),
    });
