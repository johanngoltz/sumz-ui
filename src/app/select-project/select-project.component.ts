import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';
import { ProjectsService } from '../projects.service';
import { Project } from '../project';

@Component({
  selector: 'app-select-project',
  templateUrl: './select-project.component.html',
  styleUrls: ['./select-project.component.css'],
})
export class SelectProjectComponent implements OnInit {
  constructor(private bottomSheetRef: MatBottomSheetRef<SelectProjectComponent>, private _projectsService: ProjectsService) { }

  ngOnInit() {
  }

  selectProject(project: Project) {
    this.bottomSheetRef.dismiss();
  }

}
