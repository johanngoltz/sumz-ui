import { Injectable } from '@angular/core';
import { ScenariosService } from './scenarios.service';
import { Scenario, AccountingFigure } from '../api/scenario';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ScenariosServiceMock extends ScenariosService {
    constructor(protected _scenariosStorage: Scenario[]) {
        super(null);
        this._scenarios$.next(this._scenariosStorage);
    }

    getScenarios() {
        return this.scenarios$;
    }

    getScenario(id: number) {
        return this.scenarios$.pipe(
            switchMap(scenarios => of(scenarios.find(s => s.id === id))),
        );
    }

    addScenario(scenario: Scenario) {
        this._scenariosStorage.push(scenario);
        this._scenarios$.next(this._scenariosStorage);
        return of(scenario);
    }

    updateScenario(scenario: Scenario) {
        return of(scenario);
    }
}
