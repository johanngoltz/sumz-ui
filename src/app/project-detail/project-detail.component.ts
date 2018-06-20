import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, from, BehaviorSubject, ReplaySubject, ConnectableObservable, interval } from 'rxjs';
import { switchMap, merge, map, withLatestFrom, flatMap, filter, publish, tap } from 'rxjs/operators';
import { FinancialData, Project, Scenario } from '../project';
import { ProjectsService } from '../projects.service';
import { ScenariosService } from '../scenarios.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css'],
})
export class ProjectDetailComponent implements OnInit {
  private forProject$: Observable<Project>;
  private allScenarios$: Observable<Scenario[]>;
  private activeScenarios$: Observable<Scenario[]>;
  private projectId: Observable<number>;
  private step = 0;

  timeSeriesColumns = ['year', 'externalCapital', 'fcf'];
  scenarioColumns = ['position', 'equityInterest', 'outsideCapitalInterest', 'corporateTax'];

  constructor(private _scenariosService: ScenariosService,
    private projectsService: ProjectsService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    const projectId$ = this.route.paramMap.pipe(switchMap(params => of(Number.parseFloat(params.get('id')))));
    this.projectId = projectId$;
    this.forProject$ = projectId$.pipe(
      switchMap(projectId => this.projectsService.getProject(projectId))
    );
    this.allScenarios$ = projectId$.pipe(
      switchMap(projectId => this._scenariosService.getScenarios(projectId))
    ).pipe(flatMap(a => a));
    this.activeScenarios$ = this.allScenarios$.pipe(
      switchMap(scenarios => of(scenarios.filter(s => s.isActive)))
    );
  }

  private addScenario() {
    of({businessTax: 25} as Scenario).pipe(
      withLatestFrom(this.projectId),
      tap(x => {
        const [scenario, pId] = x;
        return this._scenariosService.addScenario(pId, scenario);
      })
    ).pipe(flatMap(a => a))
      .subscribe(next => console.log('Scenario added: ', next));
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
}
