import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { FinancialData } from '../project';

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
  timeSeries: FormArray;
  prevYear: number;
  keys = Object.keys;

  constructor(private formBuilder: FormBuilder) {
    this.paramData = {
      revenue: { displayName: 'Umsatzerlöse', showOnCalculation: true },
      personnelCosts: { displayName: 'Personalkosten', showOnCalculation: true },
      materialCosts: { displayName: 'Materialkosten', showOnCalculation: true },
      otherCosts: { displayName: 'Sonstige Kosten', showOnCalculation: true },
      fcf: { displayName: 'Free Cash Flow', showOnCalculation: false },
      externalCapital: { displayName: 'Fremdkapital' },
    };
  }

  ngOnInit() {
    this.prevYear = new Date().getFullYear() - 1;
    this.timeSeries = this.formBuilder.array([]);
    this.formGroup = this.formBuilder.group({
      startYear: [this.prevYear - 1, Validators.required],
      endYear: [this.prevYear + 1, Validators.required],
      baseYear: [this.prevYear, Validators.required],
      calculateFcf: [false, Validators.required],
      parameterConfig: this.formBuilder.group({
        revenue: false,
        personnelCosts: false,
        materialCosts: false,
        otherCosts: false,
        fcf: false,
        externalCapital: false,
      }),
      timeSeries: this.timeSeries,
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
    const formGroup = this.formBuilder.group({
      year: [year, Validators.required],
      quarter: [quarter, Validators.required],
      externalCapital: [0, Validators.required],
      fcf: [0, Validators.required],
      revenue: [0, Validators.required],
      personnelCosts: [0, Validators.required],
      materialCosts: [0, Validators.required],
      otherCosts: [0, Validators.required],
    });

    if (index !== undefined) {
      this.timeSeries.insert(index, formGroup);
    } else {
      this.timeSeries.push(formGroup);
    }
  }

  getInsertIndex(year: number, quarter: number) {
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
  }

  trackByYear(i: number, o: FinancialData) {
    return o.year;
  }

  updateTable() {
    const startYear = this.formGroup.value.startYear;
    const endYear = this.formGroup.value.endYear;
    const years = this.timeSeries.value.map(o => {
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
