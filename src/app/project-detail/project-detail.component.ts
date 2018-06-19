import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, merge, map, withLatestFrom } from 'rxjs/operators';
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
  timeSeriesColumns = ['year', 'externalCapital', 'fcf'];
  scenarioColumns = ['equityInterest', 'outsideCapitalInterest', 'businessTax'];
  timeSeries: FinancialData[] = [{
    year: 2017,
    externalCapital: 5645646,
    fcf: 4531.1,
  }];
  alert = window.alert;

  constructor(private scenariosService: ScenariosService,
    private projectsService: ProjectsService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    const projectId$ = this.route.paramMap.pipe(switchMap(params => of(Number.parseFloat(params.get('id')))));
    this.forProject$ = projectId$.pipe(
      switchMap(projectId => this.projectsService.getProject(projectId))
    );
    /*
    this.forProject$.subscribe(newProject => this.scenariosService.getScenarios(newProject.id));
    this.allScenarios$ = this.scenariosService.scenarios$.pipe(
      switchMap(scenarios => scenarios.get ? Promise.resolve(scenarios.get(200)) : undefined)
    );
    this.activeScenarios$ = this.allScenarios$.pipe(
      switchMap(scenarios => Promise.resolve(scenarios.filter(s => s.isActive)))
    );*/
  }
}
