import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-accounting-data',
  templateUrl: './accounting-data.component.html',
  styleUrls: ['./accounting-data.component.css'],
})
export class FinancialDataComponent implements OnInit {
  @Input() editable: Boolean;
  @Input() formGroup: FormGroup;
  @ViewChild('scrollable') dataScrollContainer: ElementRef;
  @ViewChild('fkrow') fkRow: ElementRef;
  groupParams: String[];
  paramData: {
    'fk': {displayName: 'Fremdkapital'},
    'fcf': {displayName: 'Free Cash Flow', showOnCalculation: false},
    'revenue': {displayName: 'Umsatzerlöse', showOnCalculation: true},
    'personnelCosts': {displayName: 'Personalkosten', showOnCalculation: true},
    'materialCosts': {displayName: 'Materialkosten', showOnCalculation: true},
    'otherCosts': {displayName: 'Sonstige Kosten', showOnCalculation: true},
  };

  constructor() { }

  ngOnInit() {
    this.groupParams = Object.keys((<FormArray> this.formGroup.controls.timeSeries).at(0).value);
    this.paramData = this.paramData;
    new MutationObserver(
      // besser und logischer wäre scrollLeftMax, aber das scheint es nur in Firefox zu geben.
      () => this.dataScrollContainer.nativeElement.scrollLeft =
        this.dataScrollContainer.nativeElement.scrollLeft
      ).observe(
      this.fkRow.nativeElement,
      { childList: true });
  }

}
