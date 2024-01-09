import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCoursePipe',
  pure: false
})
export class FilterCoursePipe implements PipeTransform {

  transform(values: any, args?: any[]): any[] {
    return values = values.filter((a:any) => {
      return args.length ? args.indexOf(a.course_title) != -1 : values;
    })      
  }
}