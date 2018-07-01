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
  baseYear: number;
  startYear: number; // debounced values
  endYear: number;
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
      this.baseYear = new Date().getFullYear() - 1;
      this.startYear = this.baseYear - 1;
      this.endYear = this.baseYear;
    }
    const newFormGroup = this._formBuilder.group({
      startYear: [this.startYear, Validators.required],
      endYear: [this.endYear, Validators.required],
      baseYear: [this.baseYear, Validators.required],
      calculateFcf: [(scenario && scenario.additionalIncome && scenario.additionalIncome.timeSeries.length > 0) || false,
      Validators.required],
    }, {
        validator: (formGroup: FormGroup) => {
          return this.validateForm(formGroup);
        },
      });
    this.buildParamFormGroups(newFormGroup, scenario);
    this.formGroup = newFormGroup;
    this.formGroupOutput.emit(this.formGroup);
    this.formGroup.controls.startYear.valueChanges.pipe(debounceTime(500)).subscribe(val => {
      this.startYear = val;
      this.updateTable();
    });
    this.formGroup.controls.endYear.valueChanges.pipe(debounceTime(500)).subscribe(val => {
      this.endYear = val;
      this.updateTable();
    });
    this.updateTable();
  }

  calculateInterval(scenario: Scenario) {
    const params = Object.keys(this.paramData);
    for (let i = 0; i < params.length; i++) {
      const accountingFigure = scenario[params[i]];
      if (!this.startYear && accountingFigure.isHistoric) {
        this.startYear = accountingFigure.timeSeries[0].year;
        this.baseYear = this.baseYear || accountingFigure.timeSeries[accountingFigure.timeSeries.length - 1].year;
      } else if (!this.endYear && !accountingFigure.isHistoric) {
        this.endYear = accountingFigure.timeSeries[accountingFigure.timeSeries.length - 1].year;
        this.baseYear = this.baseYear || accountingFigure.timeSeries[0].value.year;
      }
      if (this.startYear && this.endYear) {
        break;
      }
    }
  }

  buildParamFormGroups(formGroup: FormGroup, scenario?: Scenario) {
    Object.keys(this.paramData).forEach(param => {
      const timeSeries = [];
      if (scenario && scenario[param]) {
        const items = scenario[param].timeSeries.filter(dataPoint =>
          dataPoint.year >= this.startYear &&
          dataPoint.year <= this.endYear
        );
        if (items.length > 0) {
          const firstItem = items[0];
          const lastItem = items[items.length - 1];
          if (firstItem.year > this.startYear
            || (firstItem.year === this.startYear && firstItem.quarter > 1)) {
            let year = this.startYear;
            let quarter = 1;
            while (firstItem.year > year
              || (firstItem.year === year && firstItem.quarter > quarter)) {
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
          }
          items.forEach((dataPoint) => {
            timeSeries.push(this._formBuilder.group({
              year: dataPoint.year,
              quarter: dataPoint.quarter,
              amount: [dataPoint.amount, Validators.required],
            }));
          });
          if (lastItem.year < this.endYear
            || (lastItem.year === this.endYear && lastItem.quarter < 4)) {
            let year = lastItem.year;
            let quarter = lastItem.quarter;
            if (quarter === 4) {
              year++;
              quarter = 1;
            } else {
              quarter++;
            }
            while (this.endYear > year
              || (this.endYear === year && quarter <= 4)) {
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
          }
        }
      }
      formGroup.addControl(param, this._formBuilder.group({
        isHistoric: scenario && scenario[param] ? scenario[param].isHistoric : false,
        timeSeries: this._formBuilder.array(timeSeries),
      }));
    });
  }

  createFinancialData(year: number, quarter: number, index?: number) {
    Object.keys(this.paramData).forEach((param) => {
      const array = <FormArray>(<FormGroup>this.formGroup.controls[param]).controls.timeSeries;
      const group = this._formBuilder.group({
        year: year,
        quarter: quarter,
        amount: [0, Validators.required],
      });
      if (index !== undefined) {
        array.insert(index, group);
      } else {
        array.push(group);
      }
    });
  }

  removeFinancialData(index: number) {
    Object.keys(this.paramData).forEach((param) => {
      const array = <FormArray>(<FormGroup>this.formGroup.controls[param]).controls.timeSeries;
      array.removeAt(index);
    });
  }

  trackByYearQuarter(i: number, o) {
    return o.year + ';' + o.quarter;
  }

  updateTable() {
    const startYear = this.startYear;
    const endYear = this.endYear;
    const years = (<FormGroup>this.formGroup.controls.liabilities).controls.timeSeries.value.map(o => {
      return { year: o.year, quarter: o.quarter };
    });
    let quarter = 1;
    let j = 0;
    for (let year = startYear; year <= endYear;) {
      if (years.length === 0) {
        this.createFinancialData(year, quarter, j);
        j++;
      } else {
        let found = false;
        for (; j < years.length; j++) {
          if (years[j].year === year && years[j].quarter === quarter) {
            j++;
            found = true;
            break;
          } else if ((years[j].year === year && years[j].quarter > quarter) || years[j].year > year) {
            this.createFinancialData(year, quarter, j);
            years.splice(j, 0, { year: year, quarter: quarter });
            j++;
            found = true;
            break;
          } else {
            this.removeFinancialData(j);
            years.splice(j, 1);
            j--;
          }
        }
        if (!found) {
          this.createFinancialData(year, quarter, j);
          j++;
        }
      }
      if (quarter === 4) {
        year++;
        quarter = 1;
      } else {
        quarter++;
      }
    }
    for (; j < years.length; j++) {
      this.removeFinancialData(j);
      years.splice(j, 1);
      j--;
    }
  }

  validateForm(formGroup: FormGroup) {
    const params = Object.keys(this.paramData).map(param => {
      const paramFormGroup = (<FormGroup>formGroup.controls[param]);
      if (paramFormGroup) {
        const timeSeries = (<FormArray>paramFormGroup.controls.timeSeries).controls;
        return timeSeries.filter(dataPoint =>
          dataPoint.value.year >= formGroup.value.startYear
          && dataPoint.value.year <= formGroup.value.endYear
          && (dataPoint.value.year < formGroup.value.baseYear) === paramFormGroup.value.isHistoric)
          .map(dataPoint => dataPoint.valid)
          .filter(valid => valid === false)
          .length === 0;
      } else {
        return false;
      }
    }).filter(valid => valid === false)
      .length === 0;

    const interval = formGroup.controls.baseYear.valid &&
      formGroup.controls.startYear.valid &&
      formGroup.controls.endYear.valid;

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

  checkStartYearIntegrity() {
    if (this.formGroup.controls.startYear.value >= this.baseYear) {
      this.formGroup.controls.startYear.setValue(this.baseYear - 1);
    }
  }

  checkBaseYearIntegrity() {
    if (this.formGroup.controls.baseYear.value <= this.startYear) {
      this.formGroup.controls.baseYear.setValue(this.startYear + 1);
    } else if (this.formGroup.controls.baseYear.value > this.endYear) {
      this.formGroup.controls.baseYear.setValue(this.endYear);
    }
  }

  checkEndYearIntegrity() {
    if (this.formGroup.controls.endYear.value < this.baseYear) {
      this.formGroup.controls.endYear.setValue(this.baseYear);
    }
  }
}
