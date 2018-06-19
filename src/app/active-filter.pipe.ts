import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'activeFilter',
})
export class ActiveFilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value;
  }

}
