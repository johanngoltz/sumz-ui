import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../material.module';
import { ProjectsService } from '../projects.service';
import { ScenariosService } from '../scenarios.service';
import { Project } from '../project';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css'],
})
export class ProjectDetailComponent implements OnInit {
  public columnsFromProject: ['name', 'iterations'];
  private forProject: Project;

  constructor(private scenariosService: ScenariosService,
    private projectsService: ProjectsService) {
    this.forProject = new Project();
    this.forProject.iterations = 5;
    this.forProject.name = 'Blabla';
    this.forProject.id = 200;
  }

  ngOnInit() {
    this.scenariosService.getScenarios(this.forProject.id);
  }
}
