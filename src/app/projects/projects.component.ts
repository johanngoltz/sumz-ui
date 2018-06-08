import { Component, OnInit } from '@angular/core';
import { Project } from '../project';
import { ProjectsService } from '../projects.service';
import { Router } from '@angular/router';
import { trigger, transition, query, stagger, keyframes, animate, style } from '@angular/animations';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  animations: [
    trigger('gridAnimation', [
      transition('* => *', [
        query(':enter app-project-card', [
          style({ transform: 'translateY(25px)', opacity: 0 }),
          stagger(200, [
            animate('.2s cubic-bezier(0.0, 0.0, 0.2, 1)', keyframes([
              style({ transform: 'translateY(0px)', opacity: 1 }),
            ])),
          ])], { optional: true }),
      ]),
    ]),
  ],
})
export class ProjectsComponent implements OnInit {
  projects: Project[];

  constructor(private projectsService: ProjectsService) { }

  ngOnInit() { }

}
