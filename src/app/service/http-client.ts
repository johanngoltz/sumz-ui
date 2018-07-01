import { InjectionToken } from '@angular/core';
import axios from 'restyped-axios';
import { ScenarioAPI } from '../api/api';
import { environment } from '../../environments/environment';

// TODO: Ist das Best Practice?
export const ScenarioClient = new InjectionToken(
    'TypedAxiosInstance', {
        providedIn: 'root',
        factory: () => axios.create<ScenarioAPI>({ baseURL: environment.apiUrl }),
    });
