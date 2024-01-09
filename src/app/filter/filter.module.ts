import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilterPipe } from './../service/filter/category/filter.pipe';
import { FilterBrandPipe } from './../service/filter/brand/filter-brand.pipe';
import { FilterCoursePipe } from '../service/filter/course/filter-course.pipe';
import { FilterCuisinePipe } from '../service/filter/cuisine/filter-cuisine.pipe';
import { FilterHostPipe } from '../service/filter/host/filter-host.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ 
    FilterPipe,
    FilterBrandPipe,
    FilterCoursePipe,
    FilterCuisinePipe,
    FilterHostPipe
  ],
  exports: [ 
    FilterPipe,
    FilterBrandPipe,
    FilterCoursePipe,
    FilterCuisinePipe,
    FilterHostPipe
  ]
})
export class FilterModule { }
