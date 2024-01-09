import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { ProductService } from '../../../service/product/product.service';
import { Category } from '../../../service/category/category';
import { CategoryService } from '../../../service/category/category.service';

import { OrderPipe } from 'ngx-order-pipe';
import { OrderByPipe } from '../../../filter/order-pipe/order.pipe';
import { Meta, Title } from '@angular/platform-browser';
import { TermService } from '../../../service/term/term.service';
import { LocalStorageService } from 'ngx-webstorage';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-product-list-brand',
  templateUrl: './product-list-brand.component.html',
  styleUrls: ['./product-list-brand.component.css']
})
export class ProductListBrandComponent implements OnInit {
  public formModal = false;
  public formModalSortby = false;

  page: number = 1;
  limit: number = 0;
  offset: number = 0;

  products: Array<any> = [];
  arrayProducts: Array<any> = []
  categories: Category[];
  filterArr: any = [];

  today = Date.now();

  reverse: boolean = false;
    filterSortby: string;
    filterSortbys: string = 'id';
    dataSortbys: any[] = [
        { name:'Newest', value:'id'},
        { name:'Highest Price', value:'discount_price' }
    ]
    dataSortby: any[] = [
        {name:'Lowest Price', value:'discount_price'},
        {name:'Alphabet', value:'name'},
        {name:'Brand', value:'brand_name'}
    ]
  metaTag: any;
  lang: any;
  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  token: any;
  navigationSubscription: any;
  count: number = 0
  notFound: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private orderPipe: OrderPipe,
    private orderByPipe: OrderByPipe,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title,
    private localSt: LocalStorageService,
    private deviceService: DeviceDetectorService
  ) {
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
          if (e instanceof NavigationEnd) {
            this.initialiseInvites();
          }
      });
      this.route.queryParams.subscribe((params: any) => {
          let param = params['category'];
          setTimeout(() => {
            this.getProduct(param);
          }, 3000)
      });
      this.getMeta()
    }

    initialiseInvites() { 
      this.lang = this.localSt.retrieve('lang');
      let token = this.localSt.retrieve('token');
      if(token){
          this.token = CryptoJS.AES.decrypt(token, this.key).toString(CryptoJS.enc.Utf8);
      }
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
    
  }

  cekStatus(value:string) {
      if(value == 'first_sort'){
          this.filterSortby = '';
          this.reverse = true;
      }
      else{
          this.filterSortbys = '';
          this.reverse = true;
      }
  }

  getFilterCategory(): void {
     this.formModal = true;
  }

  getFilterSortby(): void {
      this.formModalSortby = true;
  }

  closeModal(): void{
     this.formModal = false; 
     this.formModalSortby = false;
  }

  getProduct(category: any): void {
    this.count = 0
    const brand = this.route.snapshot.paramMap.get('brand');
    const publish = 'T';
    const sidx = 'id';
    const sort = 'asc';
    const limit = this.limit;
    const offset = this.offset;

    this.titleService.setTitle('KitchenArt - Product ' + brand);

    this.productService.getProductByBrand(brand, category, publish, sidx, sort, limit, offset, this.token)
    .subscribe((products: any) => {
      this.products = products['kitchenart']['results']
      this.categories = products['kitchenart']['filter_categories']
      this.count = this.products.length
      if(this.count > 0) {
        this.notFound = false
      }
      else{
        this.notFound = true
      }
    });
  }

  getCategoryFilter(): void {
    const publish = 'T';
    const sidx = 'position';
    const sort = 'asc';

    this.categoryService.getCategories(publish, sidx, sort)
    .subscribe((category: any) => {
      this.categories = category['kitchenart']['results'];
    });
  }

  goProductDetail(id: any) {
    this.router.navigate(['base/', id]);
    setTimeout(() => {
      location.reload();
    }, 3000);
    // location.reload();
  }

  // @HostListener('scroll', ['$event'])
  // onScroll(event: any): void {
  //     const isMobile = this.deviceService.isMobile();
  //     const isTablet = this.deviceService.isTablet();
  //     if(isMobile){
  //       if ((event.srcElement.scrollTop) >= (680 * this.page)) {
  //           this.offset = this.offset + this.limit;
  //           const brand = this.route.snapshot.paramMap.get('brand');
  //           const publish = 'T';
  //           const sidx = 'id';
  //           const sort = 'asc';
  //           const limit = this.limit;
  //           const offset = this.offset;

  //           this.productService.getProductByBrand(brand, publish, sidx, sort, limit, offset, this.token)
  //           .subscribe((products: any) => {
  //             this.arrayProducts = this.arrayProducts.concat(products['kitchenart']['results']);
  //             this.products = this.arrayProducts
  //           });
  //           this.page++;
            
  //       }
  //     }
  //     else if(isTablet){
  //       if ((event.srcElement.scrollTop) >= (875 * this.page)) {
  //           this.offset = this.offset + this.limit;
  //           const brand = this.route.snapshot.paramMap.get('brand');
  //           const publish = 'T';
  //           const sidx = 'id';
  //           const sort = 'asc';
  //           const limit = this.limit;
  //           const offset = this.offset;

  //           this.productService.getProductByBrand(brand, publish, sidx, sort, limit, offset, this.token)
  //           .subscribe((products: any) => {
  //             this.arrayProducts = this.arrayProducts.concat(products['kitchenart']['results']);
  //             this.products = this.arrayProducts
  //           });
  //           this.page++;
            
  //       }
  //     }
  // }

}
