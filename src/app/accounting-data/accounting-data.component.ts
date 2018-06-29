import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, Optional } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { debounceTime, map } from 'rxjs/operators';
import { Scenario } from '../api/scenario';
import { Wrapper } from '../api/wrapper';

@Component({
  selector: 'app-accounting-data',
  templateUrl: './accounting-data.component.html',
  styleUrls: ['./accounting-data.component.css'],
})
export class AccountingDataComponent implements OnInit {
  @Input() editable: Boolean;
  @Input() @Optional() initialData?: Wrapper<Scenario>;
  @Output() formGroupOutput = new EventEmitter<FormGroup>();
  formGroup: FormGroup;
  @ViewChild('scrollable') dataScrollContainer: ElementRef;
  @ViewChild('fkrow') fkRow: ElementRef;
  paramData: Object;
  keys = Object.keys; // needed due to context issues in ngFor
  baseYear: number;
  startYear: number; // debounced values
  endYear: number;

  constructor(private formBuilder: FormBuilder) {
    this.paramData = {
      revenue: { displayName: 'Umsatzerlöse', showOnCalculation: true },
      additionalIncome: { displayName: 'Sonstige Erlöse', showOnCalculation: true },
      costOfMaterial: { displayName: 'Materialkosten', showOnCalculation: true },
      costOfStaff: { displayName: 'Personalkosten', showOnCalculation: true },
      additionalCosts: { displayName: 'Sonstige Kosten', showOnCalculation: true },
      investments: { displayName: 'Investitionen', showOnCalculation: true },
      divestments: { displayName: 'Desinvestitionen', showOnCalculation: true },
      liabilities: { displayName: 'Verbindlichkeiten', showOnCalculation: true },
      freeCashFlows: { displayName: 'Free Cash Flow', showOnCalculation: false },
      externalCapital: { displayName: 'Fremdkapital' },
    };
  }

  ngOnInit() {
    if (this.initialData) {
      this.calculateInterval();
    } else {
      this.baseYear = new Date().getFullYear() - 1;
      this.startYear = this.baseYear - 1;
      this.endYear = this.baseYear;
    }
    this.formGroup = this.formBuilder.group({
      startYear: [this.startYear, Validators.required],
      endYear: [this.endYear, Validators.required],
      baseYear: [this.baseYear, Validators.required],
      calculateFcf: [this.initialData ? this.initialData.valueOf().freeCashFlows.timeSeries.length > 0 : false,
        Validators.required],
    });
    this.buildParamFormGroups();
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
    /*new MutationObserver(
      // besser und logischer wäre scrollLeftMax, aber das scheint es nur in Firefox zu geben.
      () => this.dataScrollContainer.nativeElement.scrollLeft =
        this.dataScrollContainer.nativeElement.scrollLeft
      ).observe(
      this.fkRow.nativeElement,
      { childList: true });*/
  }

  calculateInterval() {
    for (let i = 0; i < Object.keys(this.paramData).length; i++) {
      const accountingFigure = this.initialData.valueOf()[this.paramData[i]];
      if (!this.startYear && accountingFigure.isHistoric) {
        this.startYear = accountingFigure.timeSeries.at(0).value.year;
        this.baseYear = this.baseYear || accountingFigure.timeSeries.at(-1).value.year;
      } else if (!this.endYear && !accountingFigure.isHistoric) {
        this.endYear = accountingFigure.timeSeries.at(-1).value.year;
        this.baseYear = this.baseYear || accountingFigure.timeSeries.at(0).value.year;
      }
      if (this.startYear && this.endYear) {
        break;
      }
    }
  }

  buildParamFormGroups() {
    Object.keys(this.paramData).forEach((param) => {
      const timeSeries = [];
      if (this.initialData) {
        this.initialData.valueOf()[param].timeSeries.forEach((financialData) => {
          timeSeries.push(this.formBuilder.group({
            year: financialData.year,
            quarter: financialData.quarter,
            amount: financialData.amount,
          }));
        });
      }
      this.formGroup.addControl(param, this.formBuilder.group({
        isHistoric: this.initialData ? this.initialData.valueOf()[param].isHistoric : false,
        timeSeries: this.formBuilder.array(timeSeries),
      }));
    });
  }

  createFinancialData(year: number, quarter: number, index?: number) {
    Object.keys(this.paramData).forEach((param) => {
      const array = <FormArray>(<FormGroup>this.formGroup.controls[param]).controls.timeSeries;
      const group = this.formBuilder.group({
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
    const years = (<FormGroup>this.formGroup.controls.externalCapital).controls.timeSeries.value.map(o => {
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
            years.splice(j, 0, {year: year, quarter: quarter});
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
