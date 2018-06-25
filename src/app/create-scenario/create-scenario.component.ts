import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheet, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AccountingFigure, Scenario } from '../api/scenario';
import { SelectScenarioComponent } from '../select-scenario/select-scenario.component';
import { ScenariosService } from '../service/scenarios.service';

@Component({
  selector: 'app-create-scenario',
  templateUrl: './create-scenario.component.html',
  styleUrls: ['./create-scenario.component.css'],
})
export class CreateScenarioComponent implements OnInit {
  timeSeries: FormArray;
  formGroup1: FormGroup;
  formGroup2: FormGroup;
  formGroup3: FormGroup;
  prevYear: number;
  @ViewChild('scrollable') dataScrollContainer: ElementRef;
  @ViewChild('fcfrow') fcfRow: ElementRef;
  busy: Boolean;

  constructor(private _formBuilder: FormBuilder, private _scenariosService: ScenariosService, private _router: Router,
    private _snackBar: MatSnackBar, private _bottomSheet: MatBottomSheet) {
  }

  ngOnInit() {
    this.busy = false;
    this.prevYear = new Date().getFullYear() - 1;
    this.timeSeries = this._formBuilder.array([this._formBuilder.group({
      year: [this.prevYear, Validators.required],
      externalCapital: [0, Validators.required],
      fcf: [0, Validators.required],
    })]);
    this.formGroup1 = this._formBuilder.group({
      name: ['', Validators.required],
      description: '',
    });
    this.formGroup2 = this._formBuilder.group({
      deterministic: true,
      algorithm: 'fcf',
      iterations: [10000, Validators.required],
      prognosisLength: [5, Validators.required],
    });
    this.formGroup3 = this._formBuilder.group({
      baseYear: [this.prevYear, Validators.required],
      timeSeries: this.timeSeries,
    });
    new MutationObserver(
      // besser und logischer wäre scrollLeftMax, aber das scheint es nur in Firefox zu geben.
      () => this.dataScrollContainer.nativeElement.scrollLeft =
        this.formGroup2.value.deterministic ? this.dataScrollContainer.nativeElement.scrollWidth :
          this.dataScrollContainer.nativeElement.scrollLeft
      ).observe(
      this.fcfRow.nativeElement,
      { childList: true });
  }

  createFinancialData(year: number, index?: number) {
    const formGroup = this._formBuilder.group({
      year: [year, Validators.required],
      externalCapital: [0, Validators.required],
      fcf: [0, Validators.required],
    });

    if (index !== undefined) {
      this.timeSeries.insert(index, formGroup);
    } else {
      this.timeSeries.push(formGroup);
    }
  }

  addYear() {
    const years = this.timeSeries.controls.map(obj => obj.value.year);
    if (this.timeSeries.controls.length > 0) {
      if (this.formGroup2.value.deterministic) {
        this.createFinancialData(Math.max(...years) + 1);
      } else {
        this.createFinancialData(Math.min(...years) - 1, 0);
      }
    } else {
      this.createFinancialData(this.formGroup3.value.baseYear);
    }
  }

  removeYear() {
    if (this.timeSeries.value.length > 0) {
      this.timeSeries.removeAt(this.formGroup2.value.deterministic ? -1 : 0);
    }
    if (this.timeSeries.value.filter(o => (o.year > this.formGroup3.value.baseYear) === this.formGroup2.value.deterministic ||
      o.year === this.formGroup3.value.baseYear).length === 0) {
      this.addYear();
    }
  }

  // FIXME
  trackByYear(i: number, o: AccountingFigure) {
    // return o.year;
    return -1;
  }

  createScenario() {
    if (this.formGroup3.valid) {
      this.busy = true;
      const scenario = {
        id: null,
        ...this.formGroup1.value,
        ...this.formGroup2.value,
        ...this.formGroup3.value,
        prognosisLength: 5,
      };
      scenario.timeSeries = scenario.timeSeries.map((o) =>
        (o.year === scenario.baseYear || (o.year > scenario.baseYear) === scenario.deterministic) ? o : false).filter(Boolean);
      this._scenariosService.addScenario(scenario);
      // FIXME
      /* .then(createdScenario => {
        this.busy = false;
        this._snackBar.open('Das Projekt wurde erfolgreich erstellt', undefined, { duration: 5000 });
        this._router.navigate(['/scenario', createdScenario.id]);
      }
      ).catch(e => {
        this.busy = false;
        this._snackBar.open(`Das Projekt konnte nicht erstellt werden. (${e.statusText})`, undefined,
          { panelClass: 'mat-warn', duration: 5000 });
      });*/
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
    // FIXME
    /*
    that.formGroup2.controls.deterministic.patchValue(scenario.deterministic);
    that.formGroup2.controls.algorithm.patchValue(scenario.algorithm);
    that.formGroup2.controls.iterations.patchValue(scenario.iterations);
    that.formGroup3.controls.baseYear.patchValue(scenario.baseYear);
    */
    while (that.timeSeries.length > 0) {
      that.timeSeries.removeAt(0);
    }
    // FIXME
    /*
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

  updateTable() {
    const baseYear = this.formGroup3.value.baseYear;
    if (baseYear != null) {
      const years = this.timeSeries.value.map(o => o.year);
      const min = Math.min(...years);
      const max = Math.max(...years);
      if (baseYear > max) {
        for (let i = 0; i < Math.min(baseYear - max, years.length); i++) {
          if (this.timeSeries.controls[0].dirty) {
            break;
          } else {
            this.timeSeries.removeAt(0);
          }
        }
        if (this.timeSeries.length > 0) {
          for (let i = max + 1; i <= baseYear; i++) {
            this.createFinancialData(i);
          }
        }
      } else if (baseYear < min) {
        for (let i = years.length - 1; i >= Math.max(0, years.length - (min - baseYear)); i--) {
          if (this.timeSeries.controls[i].dirty) {
            break;
          } else {
            this.timeSeries.removeAt(i);
          }
        }
        if (this.timeSeries.length > 0) {
          for (let i = min - 1; i >= baseYear; i--) {
            this.createFinancialData(i, 0);
          }
        }
      }
      if (this.timeSeries.length === 0) {
        this.createFinancialData(baseYear);
      }
    }
  }
}
