import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TimeSeriesMethodsService {

  constructor() { }

  checkVisibility(value, requireHistoric: Boolean, quarterly: Boolean, base, end, shifted = false) {
    return this.checkValue(value, requireHistoric, quarterly, base, shifted) &&
      (!shifted || value.year !== end.year || (quarterly && value.quarter !== end.quarter));
  }

  checkValue(value, requireHistoric: Boolean, quarterly: Boolean, base, shifted = false) {
    return ((value.year < base.year) || (value.year === base.year &&
      (!quarterly || value.quarter <= base.quarter))) === requireHistoric
      || (shifted && value.year === base.year && (!quarterly || value.quarter === base.quarter));
  }

  isInsideBounds(quarterly, start, end, value) {
    return (value.year > start.year - (quarterly ? 0 : 1) ||
      (quarterly && value.year === start.year
        && value.quarter >= start.quarter)) &&
      (value.year < end.year + (quarterly ? 0 : 1) ||
        (quarterly && value.year === end.year && value.quarter <= end.quarter));
  }

}
