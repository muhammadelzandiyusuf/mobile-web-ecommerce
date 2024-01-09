import { Component, OnInit, HostListener } from '@angular/core';
import { CatalogueService } from '../../../../service/catalogue/catalogue.service';
import { Router } from '../../../../../../node_modules/@angular/router';
import { BrandService } from '../../../../service/brand/brand.service';
import { Meta, Title } from '@angular/platform-browser';
import { TermService } from '../../../../service/term/term.service';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit {
  brands: any;
  metaTag: any;

  constructor(
    private catalogueService: CatalogueService,
    private router: Router,
    private brandService: BrandService,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title
  ) { 
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Catalogue');
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

  public formModalBrand = false;

  page: number = 1;
  limit: number = 10;
  offset: number = 0;

  arrayCatalogue: Array<any> = []
  catalogues: Array<any> = [] 
  filterBrandArr: any = [];

  ngOnInit() {
    this.getCatalogueList();
    this.getBrand();
  }

  getFilterBrand(): void {
    this.formModalBrand = true;
  } 

  closeModal(): void {
    this.formModalBrand = false;
  }

  getCatalogueList() {
    let sidx = 'id';
    let sort = 'asc';
    let limit = 10;
    let offset = 0;

    this.catalogueService.getListCatalogues(sidx, sort, limit, offset)
    .subscribe((catalogue: any) => {
      this.arrayCatalogue = catalogue['kitchenart']['results'];
      this.catalogues = this.arrayCatalogue
    })
  }

  getBrand(): void {
    const publish = 'T';
    const navbaronly = 'F';
    const sidx = 'position';
    const sort = 'asc';

    this
        .brandService
        .getBrands(publish, navbaronly, sidx, sort)
        .subscribe(brand => {
            this.brands = brand['kitchenart']['results'];
        });
  }

  goDetail(url: any) {
    this.router.navigate(['catalogue/', url]);
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: any): void {
  
      if ((event.srcElement.scrollTop) >= (349 * this.page)) {
          this.offset = this.offset + this.limit;
          const sidx = 'id';
          const sort = 'asc';
          const limit = this.limit;
          const offset = this.offset;

          this.catalogueService.getListCatalogues(sidx, sort, limit, offset)
          .subscribe((catalogue: any) => {
            this.arrayCatalogue = this.arrayCatalogue.concat(catalogue['kitchenart']['results'])
            this.catalogues = this.arrayCatalogue
          })
        
          this.page++;
      }
  }

}
