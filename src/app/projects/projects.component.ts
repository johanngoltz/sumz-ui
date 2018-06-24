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
        query(':enter', [
          style({ transform: 'translateY(25px)', opacity: 0 }),
          stagger(100, [
            animate('.2s .2s cubic-bezier(0.0, 0.0, 0.2, 1)', keyframes([
              style({ transform: 'translateY(0px)', opacity: 1 }),
            ])),
          ])], { optional: true }),
        query(':leave', [
          stagger(100, [
            animate('.2s cubic-bezier(0.4, 0.0, 1, 1)', keyframes([
              style({ transform: 'translateY(25px)', opacity: 0 }),
            ])),
          ])], { optional: true }),
      ]),
    ]),
    trigger('noDataAnimation', [
      transition('void => *', [
        animate('.2s .2s cubic-bezier(0.0, 0.0, 0.2, 1)', keyframes([
          style({ height: 0, opacity: 0 }),
          style({ height: '*', opacity: 1 }),
        ])),
      ]),
    ]),
    trigger('spinnerAnimation', [
      transition('void => *', [
        animate('.2s cubic-bezier(0.0, 0.0, 0.2, 1)', keyframes([
          style({ transform: 'translate(-50%) scale(0)' }),
          style({ transform: 'translate(-50%) scale(1)' }),
        ])),
      ]),
      transition('* => void', [
        animate('.2s cubic-bezier(0.4, 0.0, 1, 1)', keyframes([
          style({ transform: 'translate(-50%) scale(0)' }),
        ])),
      ]),
    ]),
  ],
})
export class ProjectsComponent implements OnInit {
  projects: Project[];

  constructor(private projectsService: ProjectsService) { }

  ngOnInit() { }

}
