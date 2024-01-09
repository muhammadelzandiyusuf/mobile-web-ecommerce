import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterHostPipe',
  pure: false
})
export class FilterHostPipe implements PipeTransform {

  transform(values: any, args?: any[]): any[] {
    return values = values.filter((a : any) => {
      return args.length ? args.indexOf(a.host_name) != -1 : values;
    })      
  }
}