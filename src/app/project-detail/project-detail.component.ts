import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FinancialData, Project, Scenario } from '../project';
import { ProjectsService } from '../projects.service';
import { ScenariosService } from '../scenarios.service';

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
    this.forProject$ = this.route.paramMap.pipe(
      switchMap(params =>
        this.projectsService.getProject(Number.parseInt(params.get('id'))))
    );
    this.forProject$.subscribe(newProject => this.scenariosService.getScenarios(newProject.id));
    this.allScenarios$ = this.scenariosService.scenarios$.pipe(
      switchMap(scenarios => scenarios.get ? Promise.resolve(scenarios.get(200)) : undefined)
    );
    /*
    this.activeScenarios$ = this.allScenarios$.pipe(
      switchMap(scenarios => Promise.resolve(scenarios.filter(s => s.isActive)))
    );*/
  }
}
