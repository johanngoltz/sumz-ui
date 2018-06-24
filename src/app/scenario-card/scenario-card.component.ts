import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatMenuTrigger, MatSnackBar } from '@angular/material';
import { Scenario } from '../api/scenario';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { ScenariosService } from '../service/scenarios.service';

@Component({
  selector: 'app-scenario-card',
  templateUrl: './scenario-card.component.html',
  styleUrls: ['./scenario-card.component.css'],
})
export class ScenarioCardComponent implements OnInit {
  @Input() scenario: Scenario;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  hovered: Boolean;

  constructor(private _scenariosService: ScenariosService, private _snackBar: MatSnackBar,
    private _dialog: MatDialog) { }

  ngOnInit() {
    this.hovered = false;
  }

  toggleScenarioMenu(event: Event) {
    this.trigger.openMenu();
    event.stopPropagation();
  }

  removeScenario() {
    this._dialog.open(DeleteDialogComponent, { data: { scenario: this.scenario } })
      .afterClosed().subscribe((result) => {
        if (result === true) {
          this._scenariosService.removeScenario(this.scenario)
          /* FIXME
            .then(() => this._snackBar.open(`Das Projekt "${this.scenario.name}" wurde erfolgreich gelöscht`, undefined,
              { duration: 5000 }))
            .catch(e => this._snackBar.open(`Das Projekt "${this.scenario.name}" konnte nicht gelöscht werden (${e.message})`,
              undefined, { panelClass: 'mat-warn', duration: 5000 }))*/;
        }
      });
  }
}
