import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Scenario } from '../api/scenario';
import { ScenariosService } from '../service/scenarios.service';


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

  /* variables for chart */
  private chartData: any[];
  private chartLabels: any[];
  private chartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    barPercentage: 0.99,
  };
  private chartLegend = true;
  private chartType = 'bar';


  constructor(private _scenariosService: ScenariosService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.forScenario$ = this.route.paramMap.pipe(
      switchMap(params => of(Number.parseFloat(params.get('id')))),
      switchMap(scenarioId => this._scenariosService.getScenario(scenarioId)));

    this.chartData = [{ data: [1, 2, 3, 4, 3, 2, 1], label: 'Häufigkeit' }];
    this.chartLabels = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  }

  private addScenario() {
    of({ businessTaxRate: 25 } as Scenario).pipe(
      tap(scenario => this._scenariosService.addScenario(scenario))
    ).subscribe(next => console.log('Scenario added: ', next));
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
