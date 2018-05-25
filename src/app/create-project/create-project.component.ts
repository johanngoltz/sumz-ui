import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinancialData, Project } from '../project';
import { MatIcon } from '@angular/material';

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
  @ViewChild('addYearIcon') addYearIcon : MatIcon;

  constructor(private _formBuilder: FormBuilder) {
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
      pkEquals: null
    }
    this.prevYear = new Date().getFullYear() - 1;
    this.timeSeries = this._formBuilder.array([]);
    this.stepperFormGroup1 = this._formBuilder.group({
      name: ['', Validators.required],
      description: '',
    });
    this.stepperFormGroup2 = this._formBuilder.group({
      deterministic: 'true',
      algorithm: 'fcf'
    });
    this.stepperFormGroup3 = this._formBuilder.group({
      baseYear: [this.prevYear, Validators.required],
      timeSeries: this.timeSeries
    });
  }

  addYear(baseYear: number) {
    let currYear: number;
    if (this.timeSeries.controls.length > 0) {
      currYear = Math.min(...this.timeSeries.controls.map(function (obj) { return obj.value.year }));
    } else {
      currYear = baseYear;
    }

    this.timeSeries.push(
      this._formBuilder.group({
        year: [currYear - 1, Validators.required],
        externalCapital: [0, Validators.required],
        fcf: [0, Validators.required]
      })
    );
    //this.addYearIcon._elementRef.nativeElement.scrollIntoView();
    window.setTimeout(() => this.addYearIcon._elementRef.nativeElement.scrollIntoView(), 10)
  }

  trackByYear(i: number, o: FinancialData) {
    return o.year;
  }
}
