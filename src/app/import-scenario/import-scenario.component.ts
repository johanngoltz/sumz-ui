import { Component, OnInit } from '@angular/core';
import { Scenario } from '../api/scenario';
import { environmentParams, AccountingDataParams } from '../api/paramData';
import { AlertService } from '../service/alert.service';
import { ScenariosService } from '../service/scenarios.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-import-scenario',
  templateUrl: './import-scenario.component.html',
  styleUrls: ['./import-scenario.component.css'],
})
export class ImportScenarioComponent implements OnInit {
  private _fileReader = new FileReader();
  scenario: Scenario;
  creatingScenario = false;
  readingScenario = false;
  scenarioIsValid: boolean;

  constructor(private _alertService: AlertService,
    private _scenariosService: ScenariosService,
    private _dialogRef: MatDialogRef<ImportScenarioComponent>) { }

  ngOnInit() {
    this._fileReader.onloadend = this.generateJSON;
  }

  selectFile(event) {
    this.scenarioIsValid = false;
    this.readingScenario = true;
    this._fileReader.readAsText(event.target.files[0]);
  }

  generateJSON() {
    try {
      this.scenario = JSON.parse(this._fileReader.result);
      this.scenarioIsValid = this.checkValidity();
    } catch (error) {
      this.scenarioIsValid = false;
    }
    this.readingScenario = false;
  }

  checkValidity() {
    this.scenario.id = null;
    this.scenario.name = this.scenario.name || '-';
    this.scenario.description = this.scenario.description || '';

    Object.keys(environmentParams).forEach(param => {
      if (!this.scenario[param]) {
        this.scenario[param] = 0;
      }
    });
    // A valid scenario need to have liabilities and either cost/revenue data or free cash flows
    return this.checkAccountingDataParams(undefined) && (this.checkAccountingDataParams(true) || this.checkAccountingDataParams(false));
  }

  checkAccountingDataParams(showOnCalculation: Boolean) {
    const filteredParams = Object.keys(AccountingDataParams)
      .filter(param => AccountingDataParams.prototype[param].showOnCalculation === showOnCalculation);
    return filteredParams.length === filteredParams.filter(param => this.scenario[param]).length;
  }

  createScenario() {
    this._scenariosService.addScenario(this.scenario).subscribe(
      () => {
        this._alertService.success('Das Szenario wurde erfolgreich importiert.');
        this._dialogRef.close();
      },
      () => this._alertService.warning('Das Szenario konnte nicht importiert werden.')
    );
  }

}
