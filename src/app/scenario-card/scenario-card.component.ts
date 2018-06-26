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
  // Schlimme Sache.
  // Wird scenario direkt auf Scenario typsiert, kommt es beim Compilieren zu einem Fehler, weil die
  // Dependency nicht aufgelöst werden kann. Mit der Wrapper-Klasse gibt es das Problem nicht, dafür muss der Wert
  // immer mit valueOf() adressiert werden, um nicht statische Typfehler zu bekommen.
  // Zur Laufzeit hat scenario den Typ Scenario.
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
              error => this._snackBar.open(`Das Projekt "${this.scenario.valueOf().name}" konnte nicht gelöscht werden (${error.message})`,
                undefined, { panelClass: 'mat-warn', duration: 5000 }));
        }
      });
  }
}
export class Wrapper<T> extends Object {
  valueOf(): T {
    return this.value;
  }

  constructor(private value: T) {
    super();
  }
}
