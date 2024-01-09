import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPipe',
  pure: false
})
export class FilterPipe implements PipeTransform {

  transform(values: any, args?: any[]): any[] {
    return values = values.filter((a:any) => {
      return args.length ? args.indexOf(a.category_name_english) != -1 : values;
    })      
  }
}