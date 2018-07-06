import { animate, keyframes, query, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'angular-highcharts';
import { Observable, of } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { RemoteConfig } from '../api/config';
import { AccountingDataParams, environmentParams } from '../api/paramData';
import { Scenario } from '../api/scenario';
import { AlertService } from '../service/alert.service';
import { OptionsService } from '../service/options.service';
import { ScenariosService } from '../service/scenarios.service';
import { TimeSeriesMethodsService } from '../service/time-series-methods.service';

@Component({
  selector: 'app-scenario-detail',
  templateUrl: './scenario-detail.component.html',
  styleUrls: ['./scenario-detail.component.css'],
  animations: [
    trigger('toggleEditAnimation', [
      transition('* => *', [
        query(':enter', [
          style({
            position: 'absolute',
            opacity: 0,
            right: 0,
          }),
        ], {
            optional: true,
          }),
        query(':leave', [
          animate('.2s cubic-bezier(0.4, 0.0, 1, 1)', keyframes([
            style({
              transform: 'translateY(0px)',
              opacity: 1,
            }),
            style({
              transform: 'translateY(15px)',
              opacity: 0,
            }),
          ])),
          style({
            position: 'absolute',
            opacity: 0,
            right: 0,
          }),
        ], {
            optional: true,
          }),
        query(':enter', [
          style({
            position: 'static',
          }),
          animate('.2s cubic-bezier(0.0, 0.0, 0.2, 1)', keyframes([
            style({
              transform: 'translateY(15px)',
              opacity: 0,
            }),
            style({
              transform: 'translateY(0px)',
              opacity: 1,
            }),
          ])),
        ], {
            optional: true,
          }),
      ]),
    ]),
  ],
})

export class ScenarioDetailComponent implements OnInit {
  forScenario$: Observable<Scenario>;
  forConfig$: Observable<RemoteConfig>;
  formGroup: FormGroup;
  accountingDataFormGroup: FormGroup;
  configFormGroup: FormGroup;
  accountingDataParams = AccountingDataParams.prototype;

  /* edit mode */
  editable;

  /* step holder for panels */
  step = 0;

  /*chart */
  chart;

  private readonly numberValidator = Validators.pattern('^[0-9]+(\.[0-9]{1,3})?$');
  private readonly taxRateValidators =
    [this.numberValidator, Validators.min(0), Validators.max(100), Validators.pattern('^[0-9]+(\.[0-9]{1,3})?$')];

  constructor(private _scenariosService: ScenariosService,
    private _formBuilder: FormBuilder,
    private _optionsService: OptionsService,
    private _alertService: AlertService,
    private route: ActivatedRoute,
    private _timeSeriesMethodsService: TimeSeriesMethodsService) { }

  ngOnInit() {
    this.editable = false;
    this.forScenario$ = this.route.paramMap.pipe(
      switchMap(params => of(Number.parseInt(params.get('id')))),
      switchMap(scenarioId => this._scenariosService.getScenario(scenarioId)));
    this.forConfig$ = this._optionsService.getConfig();
    this.formGroup = this._formBuilder.group({
      name: ['', Validators.required],
      description: '',
      equityInterestRate: ['', [Validators.required, this.numberValidator]],
      interestOnLiabilitiesRate: ['', [Validators.required, this.numberValidator]],
      businessTaxRate: ['', [Validators.required, ...this.taxRateValidators]],
      corporateTaxRate: ['', [Validators.required, ...this.taxRateValidators]],
      solidaryTaxRate: ['', [Validators.required, ...this.taxRateValidators]],
    });
    this.formGroup.disable();
    this.initData();

    this.configFormGroup = this._formBuilder.group({
      apv: false,
      cvd: false,
      fcf: false,
      fte: false,
    });
    this.configFormGroup.disable();
    this.initConfig();

    this.configFormGroup.valueChanges.subscribe(value => console.log(value));

    this.forScenario$.pipe(first()).subscribe(currentScenario => {
      this.chart = new Chart({
        chart: {
          type: 'line',
        },
        credits: {
          enabled: false,
        },
        legend: {
          enabled: false,
        },
        title: {
          text: '',
        },
        yAxis: {
          title: {
            text: 'Verteilung',
          },
        },
        xAxis: {
          categories: currentScenario.companyValueDistribution.xValues,
          title: {
            text: 'Unternehmenswert in €',
          },
        },
        series: [{
          name: ' ',
          data: currentScenario.companyValueDistribution.yValues,
        }],
      });
    });
  }

  initData() {
    this.forScenario$.pipe(first()).subscribe(currentScenario => {
      this.formGroup.controls.name.setValue(currentScenario.name);
      this.formGroup.controls.description.setValue(currentScenario.description);
      Object.keys(environmentParams).forEach(key => this.formGroup.controls[key].setValue(currentScenario[key] * 100));
    });
  }

  initConfig() {
    this.forScenario$.pipe(first()).subscribe(currentScenario => {
      this.forConfig$.pipe(first()).subscribe(remote => {
        this.configFormGroup.setValue(remote.scenarioConfig.get(currentScenario.id).showResult);
      });
    });
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  saveScenario() {
    this.forScenario$.pipe(first()).subscribe(currentScenario => {

      currentScenario.name = this.formGroup.controls.name.value;
      currentScenario.description = this.formGroup.controls.description.value;
      Object.keys(environmentParams).forEach(key => currentScenario[key] = this.formGroup.controls[key].value / 100);

      currentScenario.stochastic = false;
      currentScenario.periods = (this.accountingDataFormGroup.value.endYear - this.accountingDataFormGroup.value.startYear) * 4;

      const quarterly = this.accountingDataFormGroup.controls.quarterly.value;
      const start = this.accountingDataFormGroup.controls.start.value;
      const base = this.accountingDataFormGroup.controls.base.value;
      const end = this.accountingDataFormGroup.controls.end.value;
      Object.keys(AccountingDataParams)
        .filter((param: keyof AccountingDataParams) =>
          this._timeSeriesMethodsService.shouldDisplayAccountingDataParam(
            this.accountingDataParams, this.accountingDataFormGroup.value.calculateFcf, param))
        .forEach((param) => {
          const paramFormGroup = this.accountingDataFormGroup.controls[param];
          if (paramFormGroup.value.isHistoric && !currentScenario.stochastic) {
            currentScenario.stochastic = true;
          }
          currentScenario[param] = {
            isHistoric: paramFormGroup.value.isHistoric,
            timeSeries: paramFormGroup.value.timeSeries.filter(dataPoint =>
              this._timeSeriesMethodsService.isInsideBounds(quarterly, start, end, dataPoint) &&
              this._timeSeriesMethodsService.checkVisibility(
                dataPoint,
                paramFormGroup.value.isHistoric,
                quarterly,
                base,
                end,
                AccountingDataParams[param].shiftDeterministic)),
          };
        });

      this._scenariosService.updateScenario(currentScenario).subscribe(
        () => {
          this.editable = false;
          this.formGroup.disable();
          this._alertService.success('Scenario wurde gespeichert');
        },
        () => this._alertService.warning('Scenario konnte nicht gespeichert werden'),
      );
    });
  }

  saveConfig() {
    this.forScenario$.pipe(first()).subscribe(currentScenario => {
      this.forConfig$.pipe(first()).subscribe(remote => {
        const currentConfig = {
          ...remote.scenarioConfig.get(currentScenario.id),
          showResult: {
            apv: this.configFormGroup.controls.apv.value,
            cvd: this.configFormGroup.controls.cvd.value,
            fcf: this.configFormGroup.controls.fcf.value,
            fte: this.configFormGroup.controls.fte.value,
          },
        };

        remote.scenarioConfig.set(currentScenario.id, currentConfig);
        this._optionsService.setConfig(remote);
        this.configFormGroup.disable();
      });
    });
  }

  setEditable(editable: Boolean, save?: Boolean) {
    if (editable) {
      this.formGroup.enable();
      this.configFormGroup.enable();
      this.editable = editable;
    } else {
      if (save) {
        if (this.formGroup.valid && this.accountingDataFormGroup.valid) {
          this.saveConfig();
          this.saveScenario();
        } else {
          this._alertService.error('Speichern des Scenarios nicht möglich. Es sind noch Fehler vorhanden');
        }
      } else {
        this.editable = editable;
        this.formGroup.disable();
        this.configFormGroup.disable();
        this.initData();
        this.initConfig();
      }
    }
  }
}
