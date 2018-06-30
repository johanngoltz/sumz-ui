import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, fromEvent, from, EMPTY } from 'rxjs';
import { switchMap, withLatestFrom, tap, first } from 'rxjs/operators';
import { Scenario } from '../api/scenario';
import { RemoteConfig } from '../api/config';
import { ScenariosService } from '../service/scenarios.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { OptionsService } from '../service/options.service';
import { ErrorStateMatcher } from '@angular/material/core';


/** Error when invalid control is dirty. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid && control.dirty);
  }
}

@Component({
  selector: 'app-scenario-detail',
  templateUrl: './scenario-detail.component.html',
  styleUrls: ['./scenario-detail.component.css'],
})

export class ScenarioDetailComponent implements OnInit, OnDestroy {
  forScenario$: Observable<Scenario>;
  forConfig$: Observable<RemoteConfig>;
  formGroup: FormGroup;

  /* step holder for panels */
  step = 0;

  /* selection */
  showCvd;
  showApv;
  showFcf;
  showFte;

  /* graph */
  data;
  barPadding = 0;
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Jahr';
  showYAxisLabel = true;
  yAxisLabel = 'Unternehmenswert';
  colorScheme = {
    domain: ['#0D9A39'],
  };

  /* forms */
  nameFormControl = new FormControl('', [Validators.required]);
  nameMatcher = new MyErrorStateMatcher();

  descriptionFormControl = new FormControl('', []);

  periodsFormControl = new FormControl('', [Validators.required]);
  periodsMatcher = new MyErrorStateMatcher();

  equityFormControl = new FormControl('', []);
  outsideFormControl = new FormControl('', []);
  taxFormControl = new FormControl('', []);

  constructor(private _scenariosService: ScenariosService, private _formBuilder: FormBuilder, private _optionsService: OptionsService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.forScenario$ = this.route.paramMap.pipe(
      switchMap(params => of(Number.parseFloat(params.get('id')))),
      switchMap(scenarioId => this._scenariosService.getScenario(scenarioId)));
    this.forConfig$ = this._optionsService.getConfig();
    this.formGroup = this._formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.forScenario$.pipe(first()).subscribe(currentScenario => {
      this.nameFormControl.setValue(currentScenario.name);
      this.descriptionFormControl.setValue(currentScenario.description);
      this.periodsFormControl.setValue(currentScenario.periods);
      this.equityFormControl.setValue(currentScenario.equityInterest);
      this.outsideFormControl.setValue(currentScenario.outsideCapitalInterest);
      this.taxFormControl.setValue(currentScenario.corporateTax);
    });

    this.forConfig$.pipe(first()).subscribe(config => {
      this.showCvd = config.showResult.cvd;
      this.showApv = config.showResult.apv;
      this.showFcf = config.showResult.fcf;
      this.showFte = config.showResult.fte;
    });

    this.data = [{
      'name': '2018',
      'value': 100,
    },
    {
      'name': '2019',
      'value': 120,
    },
    {
      'name': '2020',
      'value': 125,
    },
    {
      'name': '2021',
      'value': 140,
    },
    {
      'name': '2022',
      'value': 100,
    },
    ];
  }

  ngOnDestroy() {
    this.saveConfig();
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
    if (!this.nameFormControl.hasError('required') && !this.periodsFormControl.hasError('required')) {
      this.forScenario$.pipe(first()).subscribe(currentScenario => {

        currentScenario.name = this.nameFormControl.value;
        currentScenario.description = this.descriptionFormControl.value;
        currentScenario.periods = this.periodsFormControl.value;
        currentScenario.equityInterest = this.equityFormControl.value;
        currentScenario.outsideCapitalInterest = this.outsideFormControl.value;
        currentScenario.corporateTax = this.taxFormControl.value;

        this._scenariosService.updateScenario(currentScenario);
      });
    } else {
      console.log('Name ', this.nameFormControl.hasError('required'));
      console.log('periods ', this.periodsFormControl.hasError('required'));
    }
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
}
