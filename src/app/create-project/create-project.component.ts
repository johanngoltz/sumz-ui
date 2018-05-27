import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIcon, MatSnackBar, MatBottomSheet } from '@angular/material';
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
  stepperFormGroup1: FormGroup;
  stepperFormGroup2: FormGroup;
  stepperFormGroup3: FormGroup;
  prevYear: number;
  newProject: Project;
  @ViewChild('addYearIcon') addYearIcon: MatIcon;

  constructor(private _formBuilder: FormBuilder, private _projectsService: ProjectsService, private _router: Router,
    private _snackBar: MatSnackBar, private _bottomSheet: MatBottomSheet) {
  }

  ngOnInit() {
    this.newProject = {
      id: null,
      name: '',
      algorithm: 'fcf',
      baseYear: new Date().getFullYear() - 1,
      description: '',
      deterministic: true,
      iterations: 10000,
      prognosisLength: 5,
      timeSeries: [],
      pkEquals: null,
    };
    this.prevYear = new Date().getFullYear() - 1;
    this.timeSeries = this._formBuilder.array([]);
    this.stepperFormGroup1 = this._formBuilder.group({
      name: ['', Validators.required],
      description: '',
    });
    this.stepperFormGroup2 = this._formBuilder.group({
      deterministic: 'true',
      algorithm: 'fcf',
    });
    this.stepperFormGroup3 = this._formBuilder.group({
      baseYear: [this.prevYear, Validators.required],
      timeSeries: this.timeSeries,
    });
    this.timeSeries.push(
      this._formBuilder.group({
        year: [this.prevYear - 1, Validators.required],
        externalCapital: [0, Validators.required],
        fcf: [0, Validators.required],
      })
    );
  }

  addYear() {
    let currYear: number;
    if (this.timeSeries.controls.length > 0) {
      currYear = Math.min(...this.timeSeries.controls.map(obj => obj.value.year));
    } else {
      currYear = this.stepperFormGroup3.value.baseYear;
    }

    this.timeSeries.push(
      this._formBuilder.group({
        year: [currYear - 1, Validators.required],
        externalCapital: [0, Validators.required],
        fcf: [0, Validators.required],
      })
    );
    // this.addYearIcon._elementRef.nativeElement.scrollIntoView();
    window.setTimeout(() => this.addYearIcon._elementRef.nativeElement.scrollIntoView(), 10);
  }

  removeLastYear() {
    if (this.timeSeries.value.length > 0) {
      this.timeSeries.removeAt(-1);
    }
    if (this.timeSeries.value.filter(o => o.year < this.stepperFormGroup3.value.baseYear).length === 0) {
      this.addYear();
    }
  }

  trackByYear(i: number, o: FinancialData) {
    return o.year;
  }

  createProject() {
    if (this.stepperFormGroup3.valid) {
      this._projectsService.addProject({
        id: null,
        name: this.stepperFormGroup1.value.name,
        algorithm: this.stepperFormGroup2.value.algorithm,
        baseYear: this.stepperFormGroup3.value.baseYear,
        description: this.stepperFormGroup1.value.description,
        deterministic: this.stepperFormGroup2.value.deterministic === 'deterministic',
        iterations: 10000,
        prognosisLength: 5,
        timeSeries: this.timeSeries.value,
        pkEquals: null,
      }).then(() => {
        this._snackBar.open('Das Projekt wurde erfolgreich erstellt', undefined, { panelClass: 'mat-accent', duration: 5000 });
        this._router.navigate(['/project', 1]);
      }
      ).catch(e => this._snackBar.open('Das Projekt konnte nicht erstellt werden. Ein unbekannter Fehler ist aufgetreten.', undefined,
        { panelClass: 'mat-warn', duration: 5000 }));
    }
  }

  openSelectionSheet() {
    this._bottomSheet.open(SelectProjectComponent);
  }

  updateTable() {
    const baseYear = this.stepperFormGroup3.value.baseYear;
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
