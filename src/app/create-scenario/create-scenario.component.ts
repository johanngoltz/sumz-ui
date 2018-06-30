import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheet, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AccountingFigure, Scenario } from '../api/scenario';
import { SelectScenarioComponent } from '../select-scenario/select-scenario.component';
import { ScenariosService } from '../service/scenarios.service';
import { paramData } from '../api/paramData';

@Component({
  selector: 'app-create-scenario',
  templateUrl: './create-scenario.component.html',
  styleUrls: ['./create-scenario.component.css'],
})
export class CreateScenarioComponent implements OnInit {
  formGroup1: FormGroup;
  formGroup2: FormGroup;
  formGroup3: FormGroup;
  busy: Boolean;
  paramData = paramData;

  constructor(private _formBuilder: FormBuilder, private _scenariosService: ScenariosService, private _router: Router,
    private _snackBar: MatSnackBar, private _bottomSheet: MatBottomSheet) {
  }

  ngOnInit() {
    this.busy = false;
    this.formGroup1 = this._formBuilder.group({
      name: ['', Validators.required],
      description: '',
    });
    this.formGroup2 = this._formBuilder.group({
      equityInterest: ['', Validators.required],
      corporateTax: ['', Validators.required],
    });
    this.formGroup3 = this._formBuilder.group({});
  }

  createScenario() {
    if (this.formGroup3.valid) {
      this.busy = true;
      const scenario = {
        id: null,
        ...this.formGroup1.value,
        ...this.formGroup2.value,
        ...this.formGroup3.value,
        stochastic: false,
        prognosisLength: 5,
      };
      Object.keys(paramData).forEach((param) => {
        const paramFormGroup = this.formGroup3.controls[param];
        if (paramFormGroup.value.isHistoric && !scenario.stochastic) {
          scenario.stochastic = true;
        }
        scenario[param] = {
          isHistoric: paramFormGroup.value.isHistoric,
          timeSeries: paramFormGroup.value.timeSeries.filter(dataPoint =>
            dataPoint.year >= this.formGroup3.value.startYear
            && dataPoint.year <= this.formGroup3.value.endYear
            && (dataPoint.year < this.formGroup3.value.baseYear) === paramFormGroup.value.isHistoric),
        };
      });
      this._scenariosService.addScenario(scenario)
      .subscribe(
        (createdScenario) => {
          this._snackBar.open('Das Projekt wurde erfolgreich erstellt', undefined, { duration: 5000 });
          this._router.navigate(['/scenario', createdScenario.id]);
        },
        (error) => {
          this._snackBar.open(`Das Projekt konnte nicht erstellt werden. (${error.statusText})`, undefined,
          { panelClass: 'snack-mat-warn', duration: 5000 });
        },
        () => this.busy = false
      );
    }
  }

  openSelectionSheet() {
    this._bottomSheet.open(SelectScenarioComponent).afterDismissed().subscribe((scenario) => this.insertScenarioData(scenario, this));
  }

  insertScenarioData(scenario: Scenario, that: CreateScenarioComponent) {
    if (that.formGroup1.value.name.length === 0) {
      that.formGroup1.controls.name.patchValue(scenario.name);
    }
    if (that.formGroup1.value.description.length === 0) {
      that.formGroup1.controls.description.patchValue(scenario.description);
    }
    while ((<FormArray> that.formGroup3.controls.timeSeries).length > 0) {
      (<FormArray> that.formGroup3.controls.timeSeries).removeAt(0);
    }

    // TODO Fix import; calculate BaseYear, StartYear, EndYear
    /*project.timeSeries.forEach((financialData: AccountingData) => {
      (<FormArray> that.formGroup3.controls.timeSeries).push()
    }
    scenario.timeSeries.forEach((financialData: AccountingFigure) => {
      that.timeSeries.push(
        that._formBuilder.group({
          year: [financialData.year, Validators.required],
          externalCapital: [financialData.externalCapital, Validators.required],
          fcf: [financialData.fcf, Validators.required],
        })
      );
    });
    */
    that._snackBar.open(`Die Daten des Projekts "${scenario.name}" wurden erfolgreich übernommen`, undefined, { duration: 5000 });
  }

}
