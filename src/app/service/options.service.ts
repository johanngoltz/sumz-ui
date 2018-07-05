import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, of } from 'rxjs';
import { map, switchMapTo, tap } from 'rxjs/operators';
import { RemoteConfig, ScenarioConfig } from '../api/config';

@Injectable({
  providedIn: 'root',
})
export class OptionsService {
  public config$: Observable<RemoteConfig>;
  private _config$: ReplaySubject<RemoteConfig>;
  private _remoteConfig: RemoteConfig = {
    scenarioConfig: new Map<number, ScenarioConfig>([
      [1, { showResult: { apv: true, cvd: true, fcf: false, fte: false } }],
      [2, { showResult: { apv: false, cvd: false, fcf: false, fte: false } }],
      [3, { showResult: { apv: true, cvd: true, fcf: true, fte: true } }]]),
  };

  constructor() {
    this._config$ = new ReplaySubject();
    this.config$ = this._config$.asObservable();
  }

  getConfig() {
    // TODO: Make Backend request here
    return of(this._remoteConfig).pipe(
      tap(remoteConfig => this._config$.next(remoteConfig)),
      switchMapTo(this.config$),
    );
  }

  setConfig(modifiedConfig: RemoteConfig) {
    // TODO: Make Backend request here
    return of({ data: modifiedConfig }).pipe(
      map(response => response.data),
      tap(remoteConfig => {
        this._remoteConfig = remoteConfig;
        this._config$.next({ ...remoteConfig });
      }),
      switchMapTo(this.config$),
    );
  }
}
