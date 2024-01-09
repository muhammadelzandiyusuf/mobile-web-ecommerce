import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from "@angular/router";

import { ShowroomService } from '../../../../service/showroom/showroom.service';
import { Meta, Title } from '@angular/platform-browser';
import { TermService } from '../../../../service/term/term.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-showroom',
  templateUrl: './showroom.component.html',
  styleUrls: ['./showroom.component.css']
})
export class ShowroomComponent implements OnInit {
  public formModalSortby: boolean = false;
  filterSortbys: string = '6';

  page: number = 1;
  limit: number = 10;
  offset: number = 0;

  provinceId: number;
  arrayShowroom: Array<any> = []
  provinces: any = [];
  showrooms: Array<any> = [];
  metaTag: any;

  constructor(
    private router: Router,
    private showroomService: ShowroomService,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title,
    private deviceService: DeviceDetectorService
  ) { 
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Showrooms');
  }

  getMeta() {
    this.termService.getTagMeta()
    .subscribe((meta: any) => {
        this.metaTag = meta['kitchenart']['results'];

        this.meta.addTags([
            {name: 'description', content: this.metaTag['meta_description']},
            {name: 'author', content: 'kitchenart.id'},
            {name: 'keywords', content: this.metaTag['meta_keyword']}
          ]);
    })
  }

  ngOnInit() {
    this.getProvinceShowroom();
    this.getShowroomByProvinces();
  }

  getProvinceShowroom() {
    this.showroomService.getShowroomProvince()
    .subscribe((showroom: any) => {
        this.provinces = showroom['kitchenart']['results'];
    })
  }

  getShowroomByProvinces() {
    let province_id = this.filterSortbys;
    let sidx = 'id';
    let sort = 'asc';
    let limit = 10;
    let start = 0;

    this.showroomService.getShowroomByProvinces(province_id, sidx, sort, limit, start)
    .subscribe((showroom: any) => {
        this.showrooms = showroom['kitchenart']['results'];
        this.arrayShowroom = showroom['kitchenart']['results'];
    });
  }

  getShowroomProvince(province: any) {
    this.provinceId = province
    let province_id = province;
    let sidx = 'id';
    let sort = 'asc';
    let limit = 10;
    let start = 0;

    this.showroomService.getShowroomByProvinces(province_id, sidx, sort, limit, start)
    .subscribe((showroom: any) => {
        this.showrooms = showroom['kitchenart']['results'];
        this.arrayShowroom = showroom['kitchenart']['results'];
    });
  }

  getFilterSortby(): void {
    this.formModalSortby = true;
  }

  closeModal(): void{
    this.getShowroomProvince(this.filterSortbys);
    this.formModalSortby = false;
    this.page = 1
    this.offset = 0
  }

  goLink(link: any): void {
    this.router.navigate(['showrooms/', link]);
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: any): void {
      const isMobile = this.deviceService.isMobile();
      const isTablet = this.deviceService.isTablet();
      if(isMobile){
          if ((event.srcElement.scrollTop) >= (930 * this.page)) {
              this.offset = this.offset + this.limit;
              const sidx = 'id';
              const sort = 'asc';
              const limit = this.limit;
              const offset = this.offset;

              this.showroomService.getShowroomByProvinces(this.provinceId, sidx, sort, limit, offset)
              .subscribe((showroom: any) => {
                  this.arrayShowroom = this.arrayShowroom.concat(showroom['kitchenart']['results'])
                  this.showrooms = this.arrayShowroom
              });

              this.page++;
          }
      }
      else if(isTablet){
          if ((event.srcElement.scrollTop) >= (599 * this.page)) {
              this.offset = this.offset + this.limit;
              const sidx = 'id';
              const sort = 'asc';
              const limit = this.limit;
              const offset = this.offset;

              this.showroomService.getShowroomByProvinces(this.provinceId, sidx, sort, limit, offset)
              .subscribe((showroom: any) => {
                  this.arrayShowroom = this.arrayShowroom.concat(showroom['kitchenart']['results'])
                  this.showrooms = this.arrayShowroom
              });

              this.page++;
          }
      }
  }

}
