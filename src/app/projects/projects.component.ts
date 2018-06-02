import { Component, OnInit } from '@angular/core';
import { Project } from '../project';
import { ProjectsService } from '../projects.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit {
  projects: Project[];
  hovered: Project;
  projectsService: ProjectsService;
  app: AppComponent;

  constructor(projectsService: ProjectsService, app: AppComponent) {
    this.projectsService = projectsService;
    this.app = app;
  }

  ngOnInit() {
    console.log(this.app.log[0], this.app.log);
  }

}
