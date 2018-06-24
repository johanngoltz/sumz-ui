import { InjectionToken } from '@angular/core';
import axios from 'restyped-axios';
import { ScenarioAPI } from '../api/api';

// TODO: Ist das Best Practice?
export const AxiosInstance = new InjectionToken(
    'TypedAxiosInstance', {
        providedIn: 'root',
        factory: () => axios.create<ScenarioAPI>({ baseURL: 'http://localhost:8080' }),
    });
