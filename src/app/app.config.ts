import { InjectionToken } from '@angular/core';

export const LOCAL_CONFIG = new InjectionToken<AppConfig>('local.config');

export const DEV_LOCAL_CONFIG: LocalConfig = {
    exists: true,
};

export interface AppConfig extends LocalConfig, PersistedConfig {

}

export interface LocalConfig {
    exists: boolean;
}

export interface PersistedConfig {
    displayResults: boolean[];
}
