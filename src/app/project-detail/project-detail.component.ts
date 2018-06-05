import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../material.module';
import { ProjectsService } from '../projects.service';
import { ScenariosService } from '../scenarios.service';
import { Project, Scenario, FinancialData } from '../project';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
    projectId: 200,
    year: 2017,
    externalCapital: 5645646,
    fcf: 4531.1,
  }];

  constructor(private scenariosService: ScenariosService,
    private projectsService: ProjectsService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.forProject$ = this.route.paramMap.pipe(
      switchMap(params =>
        this.projectsService.getProject(Number.parseInt(params.get('id'))))
    );
    this.activeScenarios$ = this.allScenarios$ = this.forProject$.pipe(
      switchMap(project => this.scenariosService.getScenarios(project.id))
    );
  }
}
