import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { debounceTime, map, first } from 'rxjs/operators';
import { Scenario } from '../api/scenario';
import { Observable } from 'rxjs';
import { paramData } from '../api/paramData';

@Component({
  selector: 'app-accounting-data',
  templateUrl: './accounting-data.component.html',
  styleUrls: ['./accounting-data.component.css'],
})
export class AccountingDataComponent implements OnInit {
  @Input() private _editable: Boolean;
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

  constructor(private _formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.buildForm();
    if (this.initialData) {
      this.initialData.subscribe((scenario) => this.buildForm(scenario));
    }
    /*new MutationObserver(
      // besser und logischer wäre scrollLeftMax, aber das scheint es nur in Firefox zu geben.
      () => this.dataScrollContainer.nativeElement.scrollLeft =
        this.dataScrollContainer.nativeElement.scrollLeft
      ).observe(
      this.fkRow.nativeElement,
      { childList: true });*/
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
      quarterly: [scenario && scenario.additionalIncome.timeSeries[0].quarter !== undefined, Validators.required],
    }, {
        validator: (formGroup: FormGroup) => {
          return this.validateForm(formGroup);
        },
      });
    this.buildParamFormGroups(newFormGroup, scenario);
    this.formGroup = newFormGroup;
    console.log(this.formGroup);
    this.updateTable();
    this.formGroupOutput.emit(this.formGroup);
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
        this.end = {
          year: accountingFigure.timeSeries[accountingFigure.timeSeries.length - 1].year,
          quarter: accountingFigure.timeSeries[accountingFigure.timeSeries.length - 1].quarter ?
            accountingFigure.timeSeries[accountingFigure.timeSeries.length - 1].quarter : 1,
        };
        this.base = this.base || {
          year: accountingFigure.timeSeries[0].year,
          quarter: accountingFigure.timeSeries[0].quarter ? accountingFigure.timeSeries[0].quarter : 1,
        };
      }
      if (this.start && this.end) {
        return;
      }
    }
    if (!this.start) {
      this.start = { year: this.base.year - 1, quarter: this.base.quarter };
    } else {
      this.end = { year: this.base.year + 1, quarter: this.base.quarter };
    }
  }

  buildParamFormGroups(formGroup: FormGroup, scenario?: Scenario) {
    Object.keys(this.paramData).forEach(param => {
      const timeSeries = [];
      if (scenario && scenario[param]) {
        const items = scenario[param].timeSeries.filter(dataPoint => this.isInsideBounds(dataPoint));
        if (items.length > 0) {
          items.forEach((dataPoint) => {
            timeSeries.push(this._formBuilder.group({
              year: dataPoint.year,
              quarter: dataPoint.quarter,
              amount: [dataPoint.amount, Validators.required],
            }));
          });
          /*if (lastItem.year < this.end.year
            || (lastItem.year === this.end.year && lastItem.quarter < 4)) {
            let year = lastItem.year;
            let quarter = lastItem.quarter;
            if (quarter === 4) {
              year++;
              quarter = 1;
            } else {
              quarter++;
            }
            while (this.end.year > year
              || (this.end.year === year && quarter <= 4)) {
              timeSeries.push(this._formBuilder.group({
                year: year,
                quarter: quarter,
                amount: [0, Validators.required],
              }));
              if (quarter === 4) {
                year++;
                quarter = 1;
              } else {
                quarter++;
              }
            }
          }*/
        }
      }
      formGroup.addControl(param, this._formBuilder.group({
        isHistoric: scenario && scenario[param] ? scenario[param].isHistoric : false,
        timeSeries: this._formBuilder.array(timeSeries),
      }));
    });
  }

  createFinancialData(timeSeries, year: number, quarter?: number) {
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
    timeSeries.push(group);
  }

  removeFinancialData(index: number) {
    Object.keys(this.paramData).forEach((param) => {
      const array = <FormArray>(<FormGroup>this.formGroup.controls[param]).controls.timeSeries;
      array.removeAt(index);
    });
  }

  fillTimeSeriesGaps(timeSeries, start, end, shiftByOne?: Boolean) {
    const quarterly = this.formGroup.value.quarterly;
    for (let currentYear = start.year + (shiftByOne ? 1 : 0); currentYear < end.year + (quarterly || shiftByOne ? 1 : 0); currentYear++) {
      if (quarterly) {
        for (let currentQuarter = (currentYear === start.year ?
          (start.quarter + (shiftByOne ? 1 : 0) === 4 ? 1 : start.quarter + (shiftByOne ? 1 : 0)) : 1);
          currentQuarter < (currentYear === end.year ? end.quarter + (shiftByOne ? 1 : 0) : 5); currentQuarter++) {
          this.createFinancialData(timeSeries, currentYear, currentQuarter);
        }
      } else {
        this.createFinancialData(timeSeries, currentYear);
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
        if (!this.isInsideBounds(timeSeries.at(i).value)) {
          timeSeries.removeAt(i);
          i--;
        }
      }
      // Fill up missing values between the start and first value
      if (timeSeries.length > 0) {
        this.fillTimeSeriesGaps(timeSeries, start, timeSeries.value[0]);
        this.fillTimeSeriesGaps(timeSeries, timeSeries.value[timeSeries.value.length - 1], end, true);
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
          this.isInsideBounds(dataPoint.value) &&
          this.checkVisibility(dataPoint.value, paramFormGroup.value.isHistoric, this.paramData[param].shiftDeterministic))
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

  isInsideBounds(value) {
    const quarterly = this.formGroup.value.quarterly;
    return (value.year > this.start.year - (quarterly ? 0 : 1) ||
      (quarterly && value.year === this.start.year
        && value.quarter >= this.start.quarter)) &&
      (value.year < this.end.year + (quarterly ? 0 : 1) ||
        (quarterly && value.year === this.end.year && value.quarter <= this.end.quarter));
  }

  checkVisibility(value, requireHistoric: Boolean, shifted?: Boolean) {
    const end = this.formGroup.controls.end.value;
    return this.checkValue(value, requireHistoric, shifted) &&
      (!shifted || value.year !== end.year || (this.formGroup.value.quarterly && value.quarter !== end.quarter));
  }

  checkValue(value, requireHistoric: Boolean, shifted?: Boolean) {
    const base = this.formGroup.controls.base.value;
    const quarterly = this.formGroup.value.quarterly;
    return (value.year < base.year) || (value.year === base.year && (!quarterly || value.quarter <= base.quarter)) === requireHistoric
      || (shifted && value.year === base.year && (!quarterly || value.quarter === base.quarter));
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
      base.controls.year.setValue(base.value.quarter === 4 || !this.formGroup.value.quarterly ? base.value.year + 1 : base.value.year);
      base.controls.quarter.setValue(base.value.quarter === 4 || !this.formGroup.value.quarterly ? 1 : base.value.quarter + 1);
    }
  }
}
