import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheet, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { FinancialData, Project } from '../project';
import { ProjectsService } from '../projects.service';
import { SelectProjectComponent } from '../select-project/select-project.component';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css'],
})
export class CreateProjectComponent implements OnInit {
  timeSeries: FormArray;
  formGroup1: FormGroup;
  formGroup2: FormGroup;
  formGroup3: FormGroup;
  prevYear: number;
  @ViewChild('scrollable') dataScrollContainer: ElementRef;
  @ViewChild('fcfrow') fcfRow: ElementRef;
  busy: Boolean;

  constructor(private _formBuilder: FormBuilder, private _projectsService: ProjectsService, private _router: Router,
    private _snackBar: MatSnackBar, private _bottomSheet: MatBottomSheet) {
  }

  ngOnInit() {
    this.busy = false;
    this.prevYear = new Date().getFullYear() - 1;
    this.timeSeries = this._formBuilder.array([this._formBuilder.group({
      year: [this.prevYear - 1, Validators.required],
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
    });
    this.formGroup3 = this._formBuilder.group({
      baseYear: [this.prevYear, Validators.required],
      timeSeries: this.timeSeries,
    });
    new MutationObserver(
      // besser und logischer wäre scrollLeftMax, aber das scheint es nur in Firefox zu geben.
      () => this.dataScrollContainer.nativeElement.scrollLeft = this.dataScrollContainer.nativeElement.scrollWidth)
      .observe(
        this.fcfRow.nativeElement,
        { childList: true });
  }

  addYear() {
    let currYear: number;
    if (this.timeSeries.controls.length > 0) {
      currYear = Math.min(...this.timeSeries.controls.map(obj => obj.value.year));
    } else {
      currYear = this.formGroup3.value.baseYear;
    }

    this.timeSeries.push(
      this._formBuilder.group({
        year: [currYear - 1, Validators.required],
        externalCapital: [0, Validators.required],
        fcf: [0, Validators.required],
      })
    );
  }

  removeLastYear() {
    if (this.timeSeries.value.length > 0) {
      this.timeSeries.removeAt(-1);
    }
    if (this.timeSeries.value.filter(o => o.year < this.formGroup3.value.baseYear).length === 0) {
      this.addYear();
    }
  }

  trackByYear(i: number, o: FinancialData) {
    return o.year;
  }

  createProject() {
    if (this.formGroup3.valid) {
      this.busy = true;
      this._projectsService.addProject({
        id: null,
        ...this.formGroup1.value,
        ...this.formGroup2.value,
        ...this.formGroup3.value,
        prognosisLength: 5,
        pkEquals: null,
      }).then(() => {
        this.busy = false;
        this._snackBar.open('Das Projekt wurde erfolgreich erstellt', undefined, { duration: 5000 });
        this._router.navigate(['/project', 1]);
      }
      ).catch(e => {
        this.busy = false;
        this._snackBar.open(`Das Projekt konnte nicht erstellt werden. (${e.message})`, undefined,
          { panelClass: 'mat-warn', duration: 5000 });
      });
    }
  }

  openSelectionSheet() {
    this._bottomSheet.open(SelectProjectComponent).afterDismissed().subscribe((result: Project) => {
      if (this.formGroup1.value.name.length === 0) {
        this.formGroup1.controls.name.patchValue(result.name);
      }
      if (this.formGroup1.value.description.length === 0) {
        this.formGroup1.controls.description.patchValue(result.description);
      }
      this.formGroup2.controls.deterministic.patchValue(result.deterministic);
      this.formGroup2.controls.algorithm.patchValue(result.algorithm);
      this.formGroup2.controls.iterations.patchValue(result.iterations);
      this.formGroup3.controls.baseYear.patchValue(result.baseYear);
      while (this.timeSeries.length > 0) {
        this.timeSeries.removeAt(0);
      }
      result.timeSeries.forEach((financialData: FinancialData) => {
        this.timeSeries.push(
          this._formBuilder.group({
            year: [financialData.year, Validators.required],
            externalCapital: [financialData.externalCapital, Validators.required],
            fcf: [financialData.fcf, Validators.required],
          })
        );
      });
      this._snackBar.open(`Die Daten des Projekts "${result.name}" wurden erfolgreich übernommen`, undefined, { duration: 5000 });
    });
  }

  updateTable() {
    const baseYear = this.formGroup3.value.baseYear;
    if (baseYear != null) {
      const years = this.timeSeries.value.map(o => o.year);
      const min = Math.min(...years);
      const max = Math.max(...years);
      if (max < baseYear - 1) {
        for (let i = max + 1; i < baseYear; i++) {
          this.timeSeries.insert(0,
            this._formBuilder.group({
              year: [i, Validators.required],
              externalCapital: [0, Validators.required],
              fcf: [0, Validators.required],
            })
          );
        }
      } else if (min >= baseYear) {
        for (let i = min - 1; i >= baseYear - 1; i--) {
          this.timeSeries.push(
            this._formBuilder.group({
              year: [i, Validators.required],
              externalCapital: [0, Validators.required],
              fcf: [0, Validators.required],
            })
          );
        }
      }
    }
  }
}
