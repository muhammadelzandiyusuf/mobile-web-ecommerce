import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCuisinePipe',
  pure: false
})
export class FilterCuisinePipe implements PipeTransform {

  transform(values: any, args?: any[]): any[] {
    return values = values.filter((a: any) => {
      return args.length ? args.indexOf(a.cuisine_title) != -1 : values;
    })      
  }
}