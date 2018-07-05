import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material';
import { Router } from '@angular/router';
import { AccountingDataParams } from '../api/paramData';
import { Scenario } from '../api/scenario';
import { SelectScenarioComponent } from '../select-scenario/select-scenario.component';
import { AlertService } from '../service/alert.service';
import { ScenariosService } from '../service/scenarios.service';
import { TimeSeriesMethodsService } from '../service/time-series-methods.service';

@Component({
  selector: 'app-create-scenario',
  templateUrl: './create-scenario.component.html',
  styleUrls: ['./create-scenario.component.css'],
})
export class CreateScenarioComponent implements OnInit {
  formGroup1: FormGroup;
  formGroup2: FormGroup;
  formGroup3: FormGroup;
  busy: Boolean;
  importedScenario: EventEmitter<Scenario>;
  accountingDataParams = AccountingDataParams.prototype;

  constructor(private _formBuilder: FormBuilder,
    private _scenariosService: ScenariosService,
    private _router: Router,
    private _alertService: AlertService,
    private _bottomSheet: MatBottomSheet,
    private _timeSeriesMethodsService: TimeSeriesMethodsService) {
  }

  ngOnInit() {
    this.busy = false;
    this.formGroup1 = this._formBuilder.group({
      name: ['', Validators.required],
      description: '',
    });
    this.formGroup2 = this._formBuilder.group({
      equityInterestRate: ['', [Validators.required, Validators.pattern('^[0-9\.]*$')]],
      interestOnLiabilitiesRate: ['', [Validators.required, Validators.pattern('^[0-9\.]*$')]],
      businessTaxRate: ['', [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^[0-9\.]*$')]],
      corporateTaxRate: ['', [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^[0-9\.]*$')]],
      solidaryTaxRate: ['', [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^[0-9\.]*$')]],
    });
    this.formGroup3 = this._formBuilder.group({});
    this.importedScenario = new EventEmitter<Scenario>();
  }

  createScenario() {
    if (this.formGroup3.valid) {
      Object.values(this.formGroup2.controls).forEach(control => control.setValue(control.value / 100));
      this.busy = true;
      const scenario = {
        id: null,
        ...this.formGroup1.value,
        ...this.formGroup2.value,
        stochastic: false,
        periods: (this.formGroup3.value.endYear - this.formGroup3.value.startYear) * 4,
      };
      const start = this.formGroup3.controls.start.value;
      const base = this.formGroup3.controls.base.value;
      const end = this.formGroup3.controls.end.value;
      const quarterly = this.formGroup3.controls.quarterly.value;
      Object.keys(this.accountingDataParams)
        .filter((param: keyof AccountingDataParams) => this._timeSeriesMethodsService.shouldDisplayAccountingDataParam(
          this.accountingDataParams, this.formGroup3.controls.calculateFcf.value, param))
        .forEach((param) => {
          const paramFormGroup = this.formGroup3.controls[param];
          if (paramFormGroup.value.isHistoric && !scenario.stochastic) {
            scenario.stochastic = true;
          }
          scenario[param] = {
            isHistoric: paramFormGroup.value.isHistoric,
            timeSeries: paramFormGroup.value.timeSeries.filter(dataPoint =>
              this._timeSeriesMethodsService.isInsideBounds(quarterly, start, end, dataPoint)
              && this._timeSeriesMethodsService.checkVisibility(dataPoint, paramFormGroup.value.isHistoric, quarterly, base, end,
                this.accountingDataParams[param].shiftDeterministic)),
          };
        });
      this._scenariosService.addScenario(scenario)
        .subscribe(
          (createdScenario) => {
            this._alertService.success('Das Szenario wurde erfolgreich erstellt');
            this._router.navigate(['/scenario', createdScenario.id]);
          },
          (error) => {
            this._alertService.error(`Das Szenario konnte nicht erstellt werden. (${error.statusText})`);
          },
          () => this.busy = false
        );
    }
  }

  openSelectionSheet() {
    this._bottomSheet.open(SelectScenarioComponent).afterDismissed().subscribe(this.insertScenarioData.bind(this));
  }

  insertScenarioData(scenario: Scenario) {
    if (scenario) {
      if (this.formGroup1.value.name.length === 0) {
        this.formGroup1.controls.name.setValue(scenario.name);
      }
      if (this.formGroup1.value.description.length === 0) {
        this.formGroup1.controls.description.setValue(scenario.description);
      }
      Object.entries(this.formGroup2.controls).forEach(([key, control]) => control.setValue(scenario[key] * 100));
      this.importedScenario.emit(scenario);
      this._alertService.success(`Die Daten des Szenarios "${scenario.name}" wurden erfolgreich übernommen`);
    }
  }

}
