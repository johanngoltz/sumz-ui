import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
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
  @Input() initialData: Wrapper<Scenario>;
  @Output() formGroupOutput = new EventEmitter<FormGroup>();
  formGroup: FormGroup;
  @ViewChild('scrollable') dataScrollContainer: ElementRef;
  @ViewChild('fkrow') fkRow: ElementRef;
  paramData: Object;
  prevYear: number;
  keys = Object.keys; // needed due to context issues in ngFor
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
      interestOnLiabilities: { displayName: 'Zinsen auf Verbindlichkeiten', showOnCalculation: true },
      freeCashFlows: { displayName: 'Free Cash Flow', showOnCalculation: false },
      externalCapital: { displayName: 'Fremdkapital' },
    };
  }

  ngOnInit() {
    this.prevYear = new Date().getFullYear() - 1;
    this.startYear = this.prevYear - 1;
    this.endYear = this.prevYear + 1;
    this.formGroup = this.formBuilder.group({
      startYear: [this.prevYear - 1, Validators.required],
      endYear: [this.prevYear + 1, Validators.required],
      baseYear: [this.prevYear, Validators.required],
      calculateFcf: [false, Validators.required],
    });
    Object.keys(this.paramData).forEach((param) => {
      this.formGroup.addControl(param, this.formBuilder.group({
        isHistoric: false,
        timeSeries: this.formBuilder.array([]),
      }));
    });
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
  }
}
