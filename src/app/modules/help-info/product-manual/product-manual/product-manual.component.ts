import { Component, OnInit, HostListener } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { TermService } from '../../../../service/term/term.service';
import { ProductManualService } from '../../../../service/product-manual/product-manual.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-product-manual',
  templateUrl: './product-manual.component.html',
  styleUrls: ['./product-manual.component.css']
})
export class ProductManualComponent implements OnInit {

  filterCategoryArr: any = [];
  public formModalCategory = false;

  metaTag: any;
  page: number = 1;
  limit: number = 10;
  offset: number = 0;

  productManuals: Array<any> = []
  arrayProductManuals: Array<any> = []
  categories: any;
  lang: any;

  constructor(
    private router: Router,
    private productManualService: ProductManualService,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title,
    private localSt: LocalStorageService
  ) { 
    this.getMeta()
    this.lang = this.localSt.retrieve('lang');
    this.titleService.setTitle('KitchenArt - Product Manual');
  }

  ngOnInit() {
    this.getProductManualCategory()
    this.getProductManuals()
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

  getProductManualCategory() {
    this.productManualService.getProductManualCategory()
    .subscribe((productManual: any) => {
        this.categories = productManual['kitchenart']['results'];
    })
  }

  getFilterCategory(): void {
    this.formModalCategory = true;
  }

  closeModal(): void{
    this.getProductManuals()
    this.formModalCategory = false;
    this.page = 1
    this.offset = 0
  }

  getProductManuals() {
    let sidx = 'id';
    let sort = 'asc';
    let limit = 10;
    let start = 0;

    this.productManualService.getProductManual(sidx, sort, limit, start, this.filterCategoryArr)
    .subscribe((productManual: any) => {
        this.productManuals = productManual['kitchenart']['results'];
        this.arrayProductManuals = productManual['kitchenart']['results'];
    });
  }

  getDetailManual(url: any) {
    this.router.navigate(['manual_product/', url]);
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: any): void {
      if ((event.srcElement.scrollTop) >= (360 * this.page)) {
          this.offset = this.offset + this.limit;
          const sidx = 'id';
          const sort = 'asc';
          const limit = this.limit;
          const offset = this.offset;

          this.productManualService.getProductManual(sidx, sort, limit, offset, this.filterCategoryArr)
          .subscribe((productManual: any) => {
              this.arrayProductManuals = this.arrayProductManuals.concat(productManual['kitchenart']['results'])
              this.productManuals = this.arrayProductManuals
          });

          this.page++;
      }
  }

}
