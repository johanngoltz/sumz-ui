import { Injectable } from '@angular/core';
import { DataPoint } from '../api/scenario';

@Injectable({
  providedIn: 'root',
})
export class TimeSeriesMethodsService {

  constructor() { }

  checkVisibility(value: DataPoint, requireHistoric: Boolean, quarterly: Boolean, base: TimePoint, end: TimePoint, shifted = false) {
    return this.checkValue(value, requireHistoric, quarterly, base, shifted) &&
      (!shifted || value.year !== end.year || (quarterly && value.quarter !== end.quarter));
  }

  checkValue(value: DataPoint, requireHistoric: Boolean, quarterly: Boolean, base: TimePoint, shifted = false) {
    return ((value.year < base.year) || (value.year === base.year &&
      (!quarterly || value.quarter <= base.quarter))) === requireHistoric
      || (shifted && value.year === base.year && (!quarterly || value.quarter === base.quarter));
  }

  isInsideBounds(quarterly: Boolean, start: TimePoint, end: TimePoint, value: TimePoint) {
    if (!quarterly) {
      // Kopien anlegen und quarter-Property löschen. "delete" geht nicht wg. call-by-reference.
      [start, end, value] = [start, end, value].map(point => ({ year: point.year }));
    }
    return !this.isBefore(value, start) && !this.isBefore(end, value);
  }

  private isBefore(first: TimePoint, second: TimePoint) {
    // Wichtig zu wissen: (undefined < undefined) === false
    return first.year < second.year || (first.year === second.year && first.quarter < second.quarter);
  }
}

interface TimePoint {
  year: number;
  quarter?: number;
}
