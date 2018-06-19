import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, from } from 'rxjs';
import { switchMap, merge, map, withLatestFrom, flatMap, filter } from 'rxjs/operators';
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
  scenarioColumns = ['position', 'equityInterest', 'outsideCapitalInterest', 'corporateTax'];

  constructor(private scenariosService: ScenariosService,
    private projectsService: ProjectsService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    const projectId$ = this.route.paramMap.pipe(switchMap(params => of(Number.parseFloat(params.get('id')))));
    this.forProject$ = projectId$.pipe(
      switchMap(projectId => this.projectsService.getProject(projectId))
    );
    this.allScenarios$ = projectId$.pipe(
      switchMap(projectId => this.scenariosService.getScenarios(projectId))
    ).pipe(flatMap(a => a));
    this.activeScenarios$ = this.allScenarios$.pipe(
      switchMap(scenarios => of(scenarios.filter(s => s.isActive)))
    );
  }
}
