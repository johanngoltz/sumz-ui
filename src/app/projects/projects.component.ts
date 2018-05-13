import { Component, OnInit } from '@angular/core';
import { Project } from '../project';
import { ProjectsService } from '../projects.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: Project[];
  projectsService: ProjectsService;
  hovered: Project;

  constructor(projectsService: ProjectsService) {
    this.projectsService = projectsService;
  }

  ngOnInit() {
    this.hovered = undefined;
  }

}
