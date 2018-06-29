import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, fromEvent, from, EMPTY } from 'rxjs';
import { switchMap, withLatestFrom, tap } from 'rxjs/operators';
import { Scenario } from '../api/scenario';
import { ScenariosService } from '../service/scenarios.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
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

export class ScenarioDetailComponent implements OnInit {
  forScenario$: Observable<Scenario>;

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
  /* TODO: Fehlermeldung wird angezeigt, obwohl Text da ist
  /* Problem: Wenn FormControl genutzt wird, muss der Wert auch über FormControl gesetzt werden
  /* an sonsten ist validator.required true beim ersten klicken
  */
  nameFormControl = new FormControl('', [Validators.required]);
  nameMatcher = new MyErrorStateMatcher();

  periodsFormControl = new FormControl('', [Validators.required]);
  periodsMatcher = new MyErrorStateMatcher();


  constructor(private _scenariosService: ScenariosService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.forScenario$ = this.route.paramMap.pipe(
      switchMap(params => of(Number.parseFloat(params.get('id')))),
      switchMap(scenarioId => this._scenariosService.getScenario(scenarioId)));

    this.showCvd = true;
    this.showApv = true;
    this.showFcf = true;
    this.showFte = true;

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
      this.forScenario$.subscribe(currentScenario => {
        console.log('Updating Scenario');
        // TODO: Modify Scenario
        this._scenariosService.updateScenario(currentScenario);
      });
    } else {
      console.log('Name ', this.nameFormControl.hasError('required'));
      console.log('periods ', this.periodsFormControl.hasError('required'));
    }
  }
}
