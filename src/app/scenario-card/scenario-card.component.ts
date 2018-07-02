import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatMenuTrigger, MatSnackBar } from '@angular/material';
import { Scenario } from '../api/scenario';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { ScenariosService } from '../service/scenarios.service';
import { Wrapper } from '../api/wrapper';

@Component({
  selector: 'app-scenario-card',
  templateUrl: './scenario-card.component.html',
  styleUrls: ['./scenario-card.component.css'],
})


export class ScenarioCardComponent implements OnInit {
  @Input() scenario: Wrapper<Scenario>;
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
    this._dialog.open(DeleteDialogComponent, { data: { scenario: this.scenario.valueOf() } })
      .afterClosed().subscribe((result) => {
        if (result === true) {
          this._scenariosService.removeScenario(this.scenario.valueOf())
            .subscribe(
              removed => this._snackBar.open(`Das Szenario "${this.scenario.valueOf().name}" wurde erfolgreich gelöscht`, undefined,
                { duration: 5000 }),
              error => this._snackBar.open(`Das Szenario "${this.scenario.valueOf().name}" konnte nicht gelöscht werden (${error.message})`,
                undefined, { panelClass: 'mat-warn', duration: 5000 }));
        }
      });
  }
}

