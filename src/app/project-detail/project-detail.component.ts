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

  projectsService: ProjectsService;
  scenariosService: ScenariosService;
  forProject: Project;

  constructor() { 
  }

  ngOnInit() {
    this.projectsService.getScenarios(this.forProject.id);
  }

}
