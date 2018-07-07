import { Injectable } from '@angular/core';
import { AccountingDataParams } from '../api/paramData';
import { TimePoint } from '../api/scenario';

@Injectable({
  providedIn: 'root',
})
export class TimeSeriesMethodsService {

  constructor() { }

  shouldDisplayAccountingDataParam(
    accountingDataParams: AccountingDataParams, calculateFcf: boolean, param: string) {
    return [undefined, calculateFcf].includes(accountingDataParams.get(param).showOnCalculation);
  }

  checkVisibility(value: TimePoint, requireHistoric: Boolean, quarterly: Boolean, base: TimePoint, end: TimePoint, shifted = false) {
    if (!quarterly) {
      [base, end, value] = [base, end, value].map(this.removeQuarter);
    }

    return (requireHistoric === !this.isBefore(base, value)
      || shifted && this.isSameTime(base, value)) &&
      (!shifted || !this.isSameTime(end, value));
  }

  isInsideBounds(quarterly: Boolean, start: TimePoint, end: TimePoint, value: TimePoint) {
    if (!quarterly) {
      [start, end, value] = [start, end, value].map(this.removeQuarter);
    }
    return !this.isBefore(value, start) && !this.isBefore(end, value);
  }

  convertToBackendFormat(flatTimeSeries) {
    return flatTimeSeries.map(flatDataPoint => {
      return {
        date: { year: flatDataPoint.year, quarter: flatDataPoint.quarter },
        amount: flatDataPoint.amount,
      };
    });
  }

  calculateIntervalLength(start: TimePoint, end: TimePoint, quarterly: Boolean) {
    return (end.year - start.year) * (quarterly ? 4 : 1) + (quarterly ? end.quarter - start.quarter : 0);
  }

  private removeQuarter(point: TimePoint) {
    point = ({ ...point });
    delete point.quarter;
    return point;
  }

  private isSameTime(first: TimePoint, second: TimePoint) {
    return first.year === second.year && first.quarter === second.quarter;
  }

  private isBefore(first: TimePoint, second: TimePoint) {
    // Wichtig zu wissen: (undefined < undefined) === false
    return first.year < second.year || (first.year === second.year && first.quarter < second.quarter);
  }
}

