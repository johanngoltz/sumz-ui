import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Project } from '../project';
import { MatMenuTrigger, MatSnackBar, MatDialog } from '@angular/material';
import { ProjectsService } from '../projects.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css'],
})
export class ProjectCardComponent implements OnInit {
  @Input() project: Project;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  hovered: Boolean;

  constructor(private _projectsService: ProjectsService, private _snackBar: MatSnackBar,
    private _dialog: MatDialog) { }

  ngOnInit() {
    this.hovered = false;
  }

  toggleProjectMenu(event: Event) {
    this.trigger.openMenu();
    event.stopPropagation();
  }

  removeProject() {
    this._dialog.open(DeleteDialogComponent, { data: { project: this.project } })
      .afterClosed().subscribe((result) => {
        if (result === true) {
          this._projectsService.removeProject(this.project)
            .then(() => this._snackBar.open(`Das Projekt "${this.project.name}" wurde erfolgreich gelöscht`, undefined,
              { duration: 5000 }))
            .catch(e => this._snackBar.open(`Das Projekt "${this.project.name}" konnte nicht gelöscht werden (${e.message})`,
              undefined, { panelClass: 'mat-warn', duration: 5000 }));
        }
      });
  }
}
