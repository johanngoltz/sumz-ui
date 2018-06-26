import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-accounting-data',
  templateUrl: './accounting-data.component.html',
  styleUrls: ['./accounting-data.component.css'],
})
export class AccountingDataComponent implements OnInit {
  @Input() editable: Boolean;
  @Output() formGroupOutput = new EventEmitter<FormGroup>();
  formGroup: FormGroup;
  @ViewChild('scrollable') dataScrollContainer: ElementRef;
  @ViewChild('fkrow') fkRow: ElementRef;
  paramData: Object;
  prevYear: number;
  keys = Object.keys;

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
      const array = <FormArray> (<FormGroup> this.formGroup.controls[param]).controls.timeSeries;
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

  /*getInsertIndex(year: number, quarter: number) {
    const years = this.timeSeries.value.map(o => {
      return { year: o.year, quarter: o.quarter };
    });
    if (years.length === 0) {
      return 0;
    }
    let i = 0;
    for (; i < years.length; i++) {
      if ((years[i].year === year && years[i].quarter > quarter) || years[i].year > year) {
        return i;
      }
    }
    return i + 1;
  }*/

  trackByYearQuarter(i: number, o) {
    return o.year + ';' + o.quarter;
  }

  updateTable() {
    const startYear = this.formGroup.value.startYear;
    const endYear = this.formGroup.value.endYear;
    const years = (<FormGroup> this.formGroup.controls.externalCapital).controls.timeSeries.value.map(o => {
      return { year: o.year, quarter: o.quarter };
    });
    let q = 1;
    let j = 0;
    for (let i = startYear; i <= endYear;) {
      let found = false;
      for (; j < years.length; j++) {
        if ((years[j].year === i && years[j].quarter > q) || years[j].year > i) {
          this.createFinancialData(i, q, j);
          found = true;
          break;
        }
      }
      if (!found) {
        this.createFinancialData(i, q);
      }
      if (q === 4) {
        i++;
        q = 1;
      } else {
        q++;
      }
    }
  }
}
