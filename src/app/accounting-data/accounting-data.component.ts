import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { debounceTime, map, first } from 'rxjs/operators';
import { Scenario } from '../api/scenario';
import { Observable } from 'rxjs';
import { paramData } from '../api/paramData';
import { TimeSeriesMethodsService } from '../service/time-series-methods.service';

@Component({
  selector: 'app-accounting-data',
  templateUrl: './accounting-data.component.html',
  styleUrls: ['./accounting-data.component.css'],
})
export class AccountingDataComponent implements OnInit {
  @Input() _editable: Boolean;
  @Input() initialData: Observable<Scenario>;
  @Output() formGroupOutput = new EventEmitter<FormGroup>();
  formGroup: FormGroup;
  @ViewChild('scrollable') dataScrollContainer: ElementRef;
  @ViewChild('fkrow') fkRow: ElementRef;
  keys = Object.keys; // needed due to context issues in ngFor
  base: { year: number, quarter: number };
  start: { year: number, quarter: number }; // debounced values
  end: { year: number, quarter: number };
  paramData = paramData;

  constructor(private _formBuilder: FormBuilder, private _timeSeriesMethodsService: TimeSeriesMethodsService) {
  }

  ngOnInit() {
    this.buildForm();
    if (this.initialData) {
      this.initialData.subscribe((scenario) => this.buildForm(scenario));
    }
  }

  @Input() set editable(value: Boolean) {
    if (this._editable !== value) {
      this._editable = value;
      if (this.initialData) {
        this.initialData.pipe(first()).subscribe((scenario) => this.buildForm(scenario));
      }
    }
  }

  buildForm(scenario?: Scenario) {
    if (scenario) {
      this.calculateInterval(scenario);
    } else {
      this.base = { year: new Date().getFullYear() - 1, quarter: 1 };
      this.start = { year: this.base.year - 1, quarter: 1 };
      this.end = { year: this.base.year + 1, quarter: 4 };
    }
    const newFormGroup = this._formBuilder.group({
      start: this._formBuilder.group({ year: [this.start.year, Validators.required], quarter: [this.start.quarter, Validators.required] }),
      end: this._formBuilder.group({ year: [this.end.year, Validators.required], quarter: [this.end.quarter, Validators.required] }),
      base: this._formBuilder.group({ year: [this.base.year, Validators.required], quarter: [this.base.quarter, Validators.required] }),
      calculateFcf: [(scenario && scenario.additionalIncome && scenario.additionalIncome.timeSeries.length > 0) || false,
      Validators.required],
      quarterly: [(scenario && scenario.liabilities.timeSeries[0] && scenario.liabilities.timeSeries[0].quarter) || false,
      Validators.required],
    }, {
        validator: (formGroup: FormGroup) => {
          return this.validateForm(formGroup);
        },
      });
    this.buildParamFormGroups(newFormGroup, scenario);
    this.formGroup = newFormGroup;
    this.updateTable();
    this.formGroupOutput.emit(this.formGroup);
    this.formGroup.controls.quarterly.valueChanges.pipe(debounceTime(500)).subscribe(val => {
      this.quarterlyChanged();
      this.updateTable();
    });
    this.formGroup.controls.start.valueChanges.pipe(debounceTime(500)).subscribe(val => {
      this.start = val;
      this.updateTable();
    });
    this.formGroup.controls.end.valueChanges.pipe(debounceTime(500)).subscribe(val => {
      this.end = val;
      this.updateTable();
    });
  }

  calculateInterval(scenario: Scenario) {
    const params = Object.keys(this.paramData);
    this.start = undefined;
    this.end = undefined;
    this.base = undefined;
    for (let i = 0; i < params.length; i++) {
      const accountingFigure = scenario[params[i]];
      if (accountingFigure && accountingFigure.timeSeries && accountingFigure.timeSeries.length > 0) {
        if (!this.start && accountingFigure.isHistoric) {
          this.start = {
            year: accountingFigure.timeSeries[0].year,
            quarter: accountingFigure.timeSeries[0].quarter ? accountingFigure.timeSeries[0].quarter : 1,
          };
          this.base = this.base || {
            year: accountingFigure.timeSeries[accountingFigure.timeSeries.length - 1].year,
            quarter: accountingFigure.timeSeries[accountingFigure.timeSeries.length - 1].quarter ?
              accountingFigure.timeSeries[accountingFigure.timeSeries.length - 1].quarter : 1,
          };
        } else if (!this.end && !accountingFigure.isHistoric) {
          const shiftDeterministic = this.paramData[params[i]].shiftDeterministic;
          let dataPoint = accountingFigure.timeSeries[accountingFigure.timeSeries.length - 1];
          let year = dataPoint.year +
            ((shiftDeterministic && (!dataPoint.quarter || dataPoint.quarter === 4)) ? 1 : 0);
          let quarter = !dataPoint.quarter ? 4 : (shiftDeterministic && dataPoint.quarter === 4) ? 1 :
            dataPoint.quarter + (shiftDeterministic) ? 1 : 0;
          this.end = {
            year: year,
            quarter: quarter,
          };
          dataPoint = accountingFigure.timeSeries[0];
          year = dataPoint.year +
            ((!shiftDeterministic && (!dataPoint.quarter || dataPoint.quarter === 1)) ? -1 : 0);
          quarter = !dataPoint.quarter ? 1 : (!shiftDeterministic && dataPoint.quarter === 1) ? 4 :
            dataPoint.quarter + (shiftDeterministic) ? -1 : 0;
          this.base = this.base || {
            year: year,
            quarter: quarter,
          };
        }
      }
      if (this.start && this.end) {
        return;
      }
    }
    if (this.end) {
      this.start = { year: this.base.year - 1, quarter: this.base.quarter };
    } else if (this.start) {
      this.end = { year: this.base.year + 1, quarter: this.base.quarter };
    } else {
      this.base = { year: new Date().getFullYear() - 1, quarter: 1 };
      this.start = { year: this.base.year - 1, quarter: 1 };
      this.end = { year: this.base.year + 1, quarter: 4 };
    }
  }

  buildParamFormGroups(formGroup: FormGroup, scenario?: Scenario) {
    Object.keys(this.paramData).forEach(param => {
      const timeSeries = [];
      if (scenario && scenario[param] && scenario[param].timeSeries) {
        const items = scenario[param].timeSeries.filter(dataPoint => this._timeSeriesMethodsService.isInsideBounds(
          this.formGroup.controls.quarterly.value,
          this.start,
          this.end,
          dataPoint
        ));
        if (items.length > 0) {
          items.forEach((dataPoint) => {
            timeSeries.push(this._formBuilder.group({
              year: dataPoint.year,
              quarter: dataPoint.quarter,
              amount: [dataPoint.amount, Validators.required],
            }));
          });
        }
      }
      formGroup.addControl(param, this._formBuilder.group({
        isHistoric: scenario && scenario[param] ? scenario[param].isHistoric : false,
        timeSeries: this._formBuilder.array(timeSeries),
      }));
    });
  }

  get timeSeriesControls() {
    return ((this.formGroup.controls.liabilities as FormGroup).controls.timeSeries as FormArray).controls;
  }

  quarterlyChanged() {
    const quarterly = this.formGroup.controls.quarterly.value;
    Object.keys(this.paramData).forEach(param => {
      const newTimeSeries = [];
      const timeSeries = <FormArray>(<FormGroup>this.formGroup.controls[param]).controls.timeSeries;
      if (quarterly) {
        timeSeries.value.forEach(dataPoint => {
          for (let i = 1; i < 5; i++) {
            if ((dataPoint.year === this.start.year && dataPoint.quarter < this.start.quarter) ||
              (dataPoint.year === this.end.year && dataPoint.quarter > this.end.quarter)) {
              continue;
            } else {
              newTimeSeries.push(this._formBuilder.group({
                year: dataPoint.year,
                quarter: i,
                amount: dataPoint.amount / 4,
              }));
            }
          }
        });
      } else {
        while (timeSeries.length > 0) {
          const values = [];
          do {
            values.push(timeSeries.value[0]);
            timeSeries.removeAt(0);
          } while (timeSeries.length > 0 && timeSeries.value[0].year === values[0].year);
          newTimeSeries.push(this._formBuilder.group({
            year: values[0].year,
            amount: values.reduce((a, b) => a ? a : 0 + b ? b : 0, 0),
          }));
        }
      }
      (<FormGroup>this.formGroup.controls[param]).setControl('timeSeries', this._formBuilder.array(newTimeSeries));
    });
  }

  createFinancialData(timeSeries: FormArray, year: number, quarter?: number, index?: number) {
    let group;
    if (quarter) {
      group = this._formBuilder.group({
        year: year,
        quarter: quarter,
        amount: [0, Validators.required],
      });
    } else {
      group = this._formBuilder.group({
        year: year,
        amount: [0, Validators.required],
      });
    }
    if (index !== undefined) {
      timeSeries.insert(index, group);
    } else {
      timeSeries.push(group);
    }
  }

  fillTimeSeriesGaps(timeSeries, start, end, insertAtStart = false, shiftByOne = false) {
    const quarterly = this.formGroup.value.quarterly;
    let insertCount = 0;
    for (let currentYear = start.year + (shiftByOne ? 1 : 0); currentYear < end.year + (quarterly || shiftByOne ? 1 : 0); currentYear++) {
      if (quarterly) {
        for (let currentQuarter = (currentYear === start.year ?
          (start.quarter + (shiftByOne ? 1 : 0) === 4 ? 1 : start.quarter + (shiftByOne ? 1 : 0)) : 1);
          currentQuarter < (currentYear === end.year ? end.quarter + (shiftByOne ? 1 : 0) : 5); currentQuarter++) {
          this.createFinancialData(timeSeries, currentYear, currentQuarter, insertAtStart ? insertCount++ : undefined);
        }
      } else {
        this.createFinancialData(timeSeries, currentYear, undefined, insertAtStart ? insertCount++ : undefined);
      }
    }
  }

  trackByYearQuarter(i: number, o) {
    return o.value.year + (o.value.quarter ? ';' + o.value.quarter : '');
  }

  updateTable() {
    const start = this.formGroup.controls.start.value;
    const end = this.formGroup.controls.end.value;
    Object.keys(this.paramData).forEach((param) => {
      const timeSeries = <FormArray>(<FormGroup>this.formGroup.controls[param]).controls.timeSeries;
      // Remove values outside bounds
      for (let i = 0; i < timeSeries.length; i++) {
        if (!this._timeSeriesMethodsService.isInsideBounds(
          this.formGroup.controls.quarterly.value,
          this.start,
          this.end,
          timeSeries.at(i).value)
        ) {
          timeSeries.removeAt(i);
          i--;
        }
      }
      // Fill up missing values between the start and first value
      if (timeSeries.length > 0) {
        this.fillTimeSeriesGaps(timeSeries, start, timeSeries.value[0], true);
        this.fillTimeSeriesGaps(timeSeries, timeSeries.value[timeSeries.value.length - 1], end, false, true);
      } else {
        this.fillTimeSeriesGaps(timeSeries, start, end);
        this.createFinancialData(timeSeries, end.year, this.formGroup.value.quarterly ? end.quarter : undefined);
      }
    });
  }

  validateForm(formGroup: FormGroup) {
    const params = Object.keys(this.paramData).map(param => {
      const paramFormGroup = (<FormGroup>formGroup.controls[param]);
      if (paramFormGroup) {
        const timeSeries = (<FormArray>paramFormGroup.controls.timeSeries).controls;
        return timeSeries.filter(dataPoint =>
          this._timeSeriesMethodsService.isInsideBounds(
            this.formGroup.controls.quarterly.value,
            this.start,
            this.end,
            dataPoint.value
          ) &&
          this._timeSeriesMethodsService.checkVisibility(
            dataPoint.value,
            paramFormGroup.value.isHistoric,
            this.formGroup.controls.quarterly.value,
            this.formGroup.controls.base.value,
            this.end,
            this.paramData[param].shiftDeterministic))
          .map(dataPoint => dataPoint.valid)
          .filter(valid => valid === false)
          .length === 0;
      } else {
        return false;
      }
    }).filter(valid => valid === false)
      .length === 0;

    const interval = formGroup.controls.base.valid &&
      formGroup.controls.start.valid &&
      formGroup.controls.end.valid;

    if (params && interval) {
      return null;
    } else {
      const errors = {};
      if (!params) {
        errors['params'] = { valid: params };
      }
      if (!interval) {
        errors['interval'] = { valid: params };
      }
    }
  }

  checkMinIntegrity(limit, subject) {
    if (limit.value.year > subject.value.year
      || (limit.value.year === subject.value.year &&
        limit.value.quarter >= subject.value.quarter)) {
      subject.controls.year.setValue(limit.value.quarter === 4 || !this.formGroup.value.quarterly ?
        limit.value.year + 1 : limit.value.year);
      subject.controls.quarter.setValue(limit.value.quarter === 4 || !this.formGroup.value.quarterly ? 1 : limit.value.quarter + 1);
    }
  }

  checkMaxIntegrity(limit, subject) {
    if (limit.value.year < subject.value.year
      || (limit.value.year === subject.value.year &&
        limit.value.quarter <= subject.value.quarter)) {
      subject.controls.year.setValue(limit.value.quarter === 1 ||
        !this.formGroup.value.quarterly ? limit.value.year - 1 : limit.value.year);
      subject.controls.quarter.setValue(limit.value.quarter === 1 && this.formGroup.value.quarterly ? 4 :
        this.formGroup.value.quarterly ? 1 : limit.value.quarter - 1);
    }
  }

  checkStartIntegrity() {
    const start = <FormGroup>this.formGroup.controls.start;
    const base = <FormGroup>this.formGroup.controls.base;
    if (start.value.year > base.value.year
      || (start.value.year === base.value.year &&
        start.value.quarter >= base.value.quarter)) {
      start.controls.year.setValue(base.value.quarter === 1 || !this.formGroup.value.quarterly ? base.value.year - 1 : base.value.year);
      start.controls.quarter.setValue(base.value.quarter === 1 && this.formGroup.value.quarterly ? 4 :
        this.formGroup.value.quarterly ? 1 : base.value.quarter - 1);
    }
  }

  checkBaseIntegrity() {
    const start = <FormGroup>this.formGroup.controls.start;
    const base = <FormGroup>this.formGroup.controls.base;
    const end = <FormGroup>this.formGroup.controls.end;
    if (start.value.year > base.value.year
      || (start.value.year === base.value.year &&
        start.value.quarter >= base.value.quarter)) {
      base.controls.year.setValue(start.value.quarter === 4 || !this.formGroup.value.quarterly ? start.value.year + 1 : start.value.year);
      base.controls.quarter.setValue(start.value.quarter === 4 || !this.formGroup.value.quarterly ? 1 : start.value.quarter + 1);
    }
    if (end.value.year < base.value.year
      || (end.value.year === base.value.year &&
        end.value.quarter <= base.value.quarter)) {
      base.controls.year.setValue(end.value.quarter === 1 || !this.formGroup.value.quarterly ? end.value.year - 1 : end.value.year);
      base.controls.quarter.setValue(end.value.quarter === 1 && this.formGroup.value.quarterly ? 4 :
        this.formGroup.value.quarterly ? 1 : end.value.quarter - 1);
    }
  }

  checkEndIntegrity() {
    const end = <FormGroup>this.formGroup.controls.end;
    const base = <FormGroup>this.formGroup.controls.base;
    if (end.value.year < base.value.year
      || (end.value.year === base.value.year &&
        end.value.quarter <= base.value.quarter)) {
      end.controls.year.setValue(base.value.quarter === 4 || !this.formGroup.value.quarterly ? base.value.year + 1 : base.value.year);
      end.controls.quarter.setValue(base.value.quarter === 4 || !this.formGroup.value.quarterly ? 1 : base.value.quarter + 1);
    }
  }
}