import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBrandPipe',
  pure: false
})
export class FilterBrandPipe implements PipeTransform {

  transform(values: any, args?: any[]): any[] {
    return values = values.filter((a:any) => {
      return args.length ? args.indexOf(a.brand_name) != -1 : values;
    })      
  }
}