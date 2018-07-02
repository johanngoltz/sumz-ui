import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, fromEvent, from, EMPTY } from 'rxjs';
import { switchMap, withLatestFrom, tap, first } from 'rxjs/operators';
import { Scenario } from '../api/scenario';
import { RemoteConfig } from '../api/config';
import { ScenariosService } from '../service/scenarios.service';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { OptionsService } from '../service/options.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { trigger, transition, query, animate, style, keyframes } from '@angular/animations';
import { paramData } from '../api/paramData';
import { Chart } from "angular-highcharts";

@Component({
  selector: 'app-scenario-detail',
  templateUrl: './scenario-detail.component.html',
  styleUrls: ['./scenario-detail.component.css'],
  animations: [
    trigger('toggleEditAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ position: 'absolute', opacity: 0, right: 0 }),
        ], { optional: true }),
        query(':leave', [
          animate('.2s cubic-bezier(0.4, 0.0, 1, 1)', keyframes([
            style({ transform: 'translateY(0px)', opacity: 1 }),
            style({ transform: 'translateY(15px)', opacity: 0 }),
          ])),
          style({ position: 'absolute', opacity: 0, right: 0 }),
        ], { optional: true }),
        query(':enter', [
          style({ position: 'static' }),
          animate('.2s cubic-bezier(0.0, 0.0, 0.2, 1)', keyframes([
            style({ transform: 'translateY(15px)', opacity: 0 }),
            style({ transform: 'translateY(0px)', opacity: 1 }),
          ])),
        ], { optional: true }),
      ]),
    ]),
  ],
})

export class ScenarioDetailComponent implements OnInit, OnDestroy {
  forScenario$: Observable<Scenario>;
  forConfig$: Observable<RemoteConfig>;
  formGroup: FormGroup;
  accountingDataFormGroup: FormGroup;
  paramData = paramData;

  /* edit mode */
  editable;

  /* step holder for panels */
  step = 0;

  /* selection */
  showCvd;
  showApv;
  showFcf;
  showFte;

  /*chart */
  chart;

  constructor(private _scenariosService: ScenariosService, private _formBuilder: FormBuilder, private _optionsService: OptionsService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.editable = false;
    this.forScenario$ = this.route.paramMap.pipe(
      switchMap(params => of(Number.parseInt(params.get('id')))),
      switchMap(scenarioId => this._scenariosService.getScenario(scenarioId)));
    this.forConfig$ = this._optionsService.getConfig();
    this.formGroup = this._formBuilder.group({
      name: ['', Validators.required],
      description: '',
      equityInterest: ['', [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^[0-9]*$')]],
      outsideCapitalInterest: ['', [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^[0-9]*$')]],
      corporateTax: ['', [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^[0-9]*$')]],
    });
    this.formGroup.disable();
    this.initData();
    this.forConfig$.pipe(first()).subscribe(config => {
      this.showCvd = config.showResult.cvd;
      this.showApv = config.showResult.apv;
      this.showFcf = config.showResult.fcf;
      this.showFte = config.showResult.fte;
    });

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
    yAxis: {
      title: {text: 'Unternehmenswert in €'},
    },
    xAxis: {
      categories: [
        '-3 σ',
        '',
        '',
        '',
        '',
        '-2 σ',
        '',
        '',
        '',
        '',
        '-1 σ',
        '',
        '',
        '',
        '',
        'μ',
        '',
        '',
        '',
        '',
        '1 σ',
        '',
        '',
        '',
        '',
        '2 σ',
        '',
        '',
        '',
        '',
        '3 σ',
      ],
    },
    series: [
      {
        name: ' ',
        data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
      },
    ],
  });
  }

  ngOnDestroy() {
    this.saveConfig();
  }

  initData() {
    this.forScenario$.pipe(first()).subscribe(currentScenario => {
      this.formGroup.controls.name.setValue(currentScenario.name);
      this.formGroup.controls.description.setValue(currentScenario.description);
      this.formGroup.controls.equityInterest.setValue(currentScenario.equityInterest);
      this.formGroup.controls.outsideCapitalInterest.setValue(currentScenario.outsideCapitalInterest);
      this.formGroup.controls.corporateTax.setValue(currentScenario.corporateTax);
    });
  }

  /* functions for panels */
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
      currentScenario.equityInterest = this.formGroup.controls.equityInterest.value;
      currentScenario.outsideCapitalInterest = this.formGroup.controls.outsideCapitalInterest.value;
      currentScenario.corporateTax = this.formGroup.controls.corporateTax.value;

      currentScenario.stochastic = false;
      currentScenario.periods = (this.accountingDataFormGroup.value.endYear - this.accountingDataFormGroup.value.startYear) * 4;

      const quarterly = this.accountingDataFormGroup.controls.quarterly.value;
      const start = this.accountingDataFormGroup.controls.start.value;
      const base = this.accountingDataFormGroup.controls.base.value;
      const end = this.accountingDataFormGroup.controls.end.value;
      Object.keys(paramData)
      .filter(param => [undefined, this.accountingDataFormGroup.value.calculateFcf].indexOf(this.paramData[param].showOnCalculation) > -1)
      .forEach((param) => {
        const paramFormGroup = this.accountingDataFormGroup.controls[param];
        if (paramFormGroup.value.isHistoric && !currentScenario.stochastic) {
          currentScenario.stochastic = true;
        }
        currentScenario[param] = {
          isHistoric: paramFormGroup.value.isHistoric,
          timeSeries: paramFormGroup.value.timeSeries.filter(dataPoint =>
            this.isInsideBounds(quarterly, start, end, dataPoint)
            && this.checkVisibility(dataPoint, paramFormGroup.value.isHistoric, quarterly, base, end, paramData[param].shiftDeterministic)),
        };
      });

      this._scenariosService.updateScenario(currentScenario).subscribe(
        () => {
          this.editable = false;
          this.formGroup.disable();
        },
        () => console.log('ERROR'), // TODO error handling
      );
    });
  }

  saveConfig() {
    this.forConfig$.pipe(first()).subscribe(config => {
      config.showResult.cvd = this.showCvd;
      config.showResult.apv = this.showApv;
      config.showResult.fcf = this.showFcf;
      config.showResult.fte = this.showFte;

      this._optionsService.setConfig(config);
    });
  }

  setEditable(editable: Boolean, save?: Boolean) {
    if (editable) {
      this.formGroup.enable();
      this.editable = editable;
    } else {
      if (save) {
        if (this.formGroup.valid && this.accountingDataFormGroup.valid) {
          this.saveScenario();
        } else {
          console.log(this.formGroup, this.accountingDataFormGroup); // TODO snackbar
        }
      } else {
        this.editable = editable;
        this.formGroup.disable();
        this.initData();
      }
    }
  }

  checkVisibility(value, requireHistoric: Boolean, quarterly: Boolean, base, end, shifted = false) {
    return this.checkValue(value, requireHistoric, quarterly, base, shifted) &&
      (!shifted || value.year !== end.year || (quarterly && value.quarter !== end.quarter));
  }

  checkValue(value, requireHistoric: Boolean, quarterly: Boolean, base, shifted = false) {
    return ((value.year < base.year) || (value.year === base.year &&
      (!quarterly || value.quarter <= base.quarter))) === requireHistoric
      || (shifted && value.year === base.year && (!quarterly || value.quarter === base.quarter));
  }

  isInsideBounds(quarterly, start, end, value) {
    return (value.year > start.year - (quarterly ? 0 : 1) ||
      (quarterly && value.year === start.year
        && value.quarter >= start.quarter)) &&
      (value.year < end.year + (quarterly ? 0 : 1) ||
        (quarterly && value.year === end.year && value.quarter <= end.quarter));
  }

}
