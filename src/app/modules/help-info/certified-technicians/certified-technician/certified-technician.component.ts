import { Component, OnInit, HostListener } from '@angular/core';
import { CertifiedTechnicianService } from '../../../../service/certified-technician/certified-technician.service';
import { Router } from '@angular/router';
import { TermService } from '../../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-certified-technician',
  templateUrl: './certified-technician.component.html',
  styleUrls: ['./certified-technician.component.css']
})
export class CertifiedTechnicianComponent implements OnInit {

  public formModalSortby: boolean = false;
  filterSortbys: string = '6';

  page: number = 1;
  limit: number = 10;
  offset: number = 0;

  provinceId: number = 6;
  arrayTechnician: Array<any> = []
  provinces: any = [];
  technicians: Array<any> = [];
  metaTag: any;

  constructor(
    private router: Router,
    private technicianService: CertifiedTechnicianService,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title
  ) { 
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Certified Technician');
  }

  ngOnInit() {
    this.getProvinceTechnician()
    this.getTechnicianByProvinces()
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

  getProvinceTechnician() {
    this.technicianService.getTechnicianProvince()
    .subscribe((province: any) => {
        this.provinces = province['kitchenart']['results'];
    })
  }

  getTechnicianByProvinces() {
    let province_id = this.filterSortbys;
    let sidx = 'id';
    let sort = 'asc';
    let limit = 10;
    let start = 0;

    this.technicianService.getTechnicianByProvinces(province_id, sidx, sort, limit, start)
    .subscribe((technician: any) => {
        this.technicians = technician['kitchenart']['results'];
        this.arrayTechnician = technician['kitchenart']['results'];
    });
  }

  getTechnicianProvince(province: any) {
    this.provinceId = province
    let province_id = province;
    let sidx = 'id';
    let sort = 'asc';
    let limit = 10;
    let start = 0;

    this.technicianService.getTechnicianByProvinces(province_id, sidx, sort, limit, start)
    .subscribe((technician: any) => {
        this.technicians = technician['kitchenart']['results'];
        this.arrayTechnician = technician['kitchenart']['results'];
    });
  }

  getFilterSortby(): void {
    this.formModalSortby = true;
  }

  closeModal(): void{
    this.getTechnicianProvince(this.filterSortbys);
    this.formModalSortby = false;
    this.page = 1
    this.offset = 0
  }

  goLink(link: any): void {
    this.router.navigate(['certified_technician/', link]);
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: any): void {

      if ((event.srcElement.scrollTop) >= (692 * this.page)) {
          this.offset = this.offset + this.limit;
          const sidx = 'id';
          const sort = 'asc';
          const limit = this.limit;
          const offset = this.offset;

          this.technicianService.getTechnicianByProvinces(this.provinceId, sidx, sort, limit, offset)
          .subscribe((technician : any) => {
              this.arrayTechnician = this.arrayTechnician.concat(technician['kitchenart']['results'])
              this.technicians = this.arrayTechnician
          });

          this.page++;
      }
  }

}
