import { Injectable, Inject } from '@angular/core';
import { LocalConfig, LOCAL_CONFIG, AppConfig, PersistedConfig } from '../app.config';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OptionsService {
  public config$: Observable<AppConfig>;
  private _config$: BehaviorSubject<AppConfig>;
  private _configStorage: PersistedConfig;

  constructor(@Inject(LOCAL_CONFIG) private _localConfig: LocalConfig) { }

  getConfig() {
    const receivedConfig: PersistedConfig = {
      displayResults: [true, false, false],
    };

    of(receivedConfig).pipe(
      switchMap(persistedConfig => {
        this._configStorage = persistedConfig;
        this._config$.next(Object.assign(this._configStorage, this._localConfig));
        return this.config$;
      })
    );
  }
}
