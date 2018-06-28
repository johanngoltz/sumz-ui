import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Scenario } from '../api/scenario';
import { ScenariosService } from '../service/scenarios.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-scenario-detail',
  templateUrl: './scenario-detail.component.html',
  styleUrls: ['./scenario-detail.component.css'],
})

export class ScenarioDetailComponent implements OnInit {
  private forScenario$: Observable<Scenario>;

  timeSeriesColumns = ['year', 'externalCapital', 'fcf'];
  scenarioColumns = ['position', 'equityInterest', 'outsideCapitalInterest', 'corporateTax'];

  /* step holder for panels */
  private step = 0;

  /* selection */
  private showCvd;
  private showApv;
  private showFcf;
  private showFte;

  /* graph */
  private data;
  private barPadding = 0;
  private showXAxis = true;
  private showYAxis = true;
  private gradient = false;
  private showLegend = false;
  private showXAxisLabel = true;
  private xAxisLabel = 'Jahr';
  private showYAxisLabel = true;
  private yAxisLabel = 'Unternehmenswert';
  private colorScheme = {
    domain: ['#0D9A39'],
  };

  /* forms */
  /* TODO: Fehlermeldung wird angezeigt, obwohl Text da ist*/
  nameFormControl = new FormControl('', [Validators.required]);
  nameMatcher = new MyErrorStateMatcher();

  periodsFormControl = new FormControl('', [Validators.required]);
  periodsMatcher = new MyErrorStateMatcher();


  constructor(private _scenariosService: ScenariosService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.forScenario$ = this.route.paramMap.pipe(
      switchMap(params => of(Number.parseFloat(params.get('id')))),
      switchMap(scenarioId => this._scenariosService.getScenario(scenarioId)));

    this.showCvd = true;
    this.showApv = true;
    this.showFcf = true;
    this.showFte = true;

    this.data = [
      {
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

}
