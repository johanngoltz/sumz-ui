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
  formGroup1: FormGroup;
  formGroup2: FormGroup;
  formGroup3: FormGroup;
  busy: Boolean;

  constructor(private _formBuilder: FormBuilder, private _projectsService: ProjectsService, private _router: Router,
    private _snackBar: MatSnackBar, private _bottomSheet: MatBottomSheet) {
  }

  ngOnInit() {
    this.busy = false;
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
    this.formGroup3 = this._formBuilder.group({});
  }

  createProject() {
    if (this.formGroup3.valid) {
      this.busy = true;
      const project = {
        id: null,
        ...this.formGroup1.value,
        ...this.formGroup2.value,
        ...this.formGroup3.value,
        prognosisLength: 5,
      };
      project.timeSeries = project.timeSeries.map((o) =>
        (o.year === project.baseYear || (o.year > project.baseYear) === project.deterministic) ? o : false).filter(Boolean);
      this._projectsService.addProject(project).then(() => {
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
    this._bottomSheet.open(SelectProjectComponent).afterDismissed().subscribe((project) => this.insertProjectData(project, this));
  }

  insertProjectData(project: Project, that: CreateProjectComponent) {
    if (that.formGroup1.value.name.length === 0) {
      that.formGroup1.controls.name.patchValue(project.name);
    }
    if (that.formGroup1.value.description.length === 0) {
      that.formGroup1.controls.description.patchValue(project.description);
    }
    that.formGroup2.controls.deterministic.patchValue(project.deterministic);
    that.formGroup2.controls.algorithm.patchValue(project.algorithm);
    that.formGroup2.controls.iterations.patchValue(project.iterations);
    that.formGroup3.controls.baseYear.patchValue(project.baseYear);
    while ((<FormArray> that.formGroup3.controls.timeSeries).length > 0) {
      (<FormArray> that.formGroup3.controls.timeSeries).removeAt(0);
    }
    project.timeSeries.forEach((financialData: FinancialData) => {
      (<FormArray> that.formGroup3.controls.timeSeries).push(
        that._formBuilder.group({
          year: [financialData.year, Validators.required],
          externalCapital: [financialData.externalCapital, Validators.required],
          fcf: [financialData.fcf, Validators.required],
        })
      );
    });
    that._snackBar.open(`Die Daten des Projekts "${project.name}" wurden erfolgreich übernommen`, undefined, { duration: 5000 });
  }

}
