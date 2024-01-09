import { Component, OnInit, HostListener } from '@angular/core';
import { Brand } from '../../../service/brand/brand';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ProductService } from '../../../service/product/product.service';
import { CategoryService } from '../../../service/category/category.service';
import { BrandService } from '../../../service/brand/brand.service';
import { OrderPipe } from 'ngx-order-pipe';
import { OrderByPipe } from '../../../filter/order-pipe/order.pipe';
import { TermService } from '../../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { LocalStorageService } from 'ngx-webstorage';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-product-list-category',
  templateUrl: './product-list-category.component.html',
  styleUrls: ['./product-list-category.component.css']
})
export class ProductListCategoryComponent implements OnInit {
  public formModal = false;
    public formModalBrand = false;
    public formModalSortby = false;

    page: number = 1;
    limit: number = 10;
    offset: number = 0;

    key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
    token: any;

    products: Array<any> = [];
    arrayProducts: Array<any> = []
    brands: Brand[];
    name: string;
    filterBrandArr: any = [];
    category: object = [];

    today = Date.now();
    statusCategory: number;

    reverse: boolean = false;
    filterSortby: string;
    filterSortbys: string = 'id';
    dataSortbys: any[] = [
        {
            name: 'Newest',
            value: 'id'
        }, {
            name: 'Highest Price',
            value: 'discount_price'
        }
    ]
    dataSortby: any[] = [
        {
            name: 'Lowest Price',
            value: 'discount_price'
        }, {
            name: 'Alphabet',
            value: 'name'
        }, {
            name: 'Brand',
            value: 'brand_name'
        }
    ]
    metaTag: any;
    lang: any;
    navigationSubscription: any;
    count: number = 0
    notFound: boolean = false;
    categories: any = [];
    title_english: any;
    title_indonesia: any;
    countCat: number = 0;

  constructor(
    private router : Router,
    private route : ActivatedRoute,
    private productService : ProductService,
    private categoryService : CategoryService,
    private brandService : BrandService,
    private orderPipe : OrderPipe,
    private orderByPipe : OrderByPipe,
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
    this
        .route
        .params
        .subscribe((params: any) => {
            this.titleService.setTitle('KitchenArt - Product ' + params['url']);
            setTimeout(() => {
                this.getCompareCategory(params['url']);
            }, 3000)
        }) 
    this.route.queryParams.subscribe((params: any) => {
        const paramBrand = params['brand'];
        setTimeout(() => {
            this.getProduct(paramBrand);
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

  ngOnInit() {
    this.getCategoryChild();
    // this.getBrand();
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

  cekStatus(value : string) {
      if (value == 'first_sort') {
          this.filterSortby = '';
          this.reverse = true;
      } else {
          this.filterSortbys = '';
          this.reverse = true;
      }
  }

  closeModal(): void {
      this.formModalBrand = false;
      this.formModalSortby = false;
  }

  getFilterSortby(): void {
      this.formModalSortby = true;
  }

  getFilterBrand(): void {
      this.formModalBrand = true;
  }

  getBrand(): void {
      const publish = 'T';
      const navbaronly = 'F';
      const sidx = 'position';
      const sort = 'asc';

      this
          .brandService
          .getBrands(publish, navbaronly, sidx, sort)
          .subscribe((brand: any) => {
              this.brands = brand['kitchenart']['results'];
          });
  }

  getProduct(brand: any): void {
      const category = this
          .route
          .snapshot
          .paramMap
          .get('url');
      const publish = 'T';
      const sidx = 'id';
      const sort = 'asc';
      const limit = 0;
      const offset = 0;
      this.arrayProducts = []

      this
          .productService
          .getProductByCategory(category, brand, publish, sidx, sort, limit, offset, this.token)
          .subscribe((product: any) => {
            //   this.arrayProducts = this.arrayProducts.concat(product['kitchenart']['results']);
              this.products = product['kitchenart']['results']
              this.brands = product['kitchenart']['filter_brand'];
              this.count = this.products.length
              if(this.count > 0) {
                this.notFound = false
              }
              else{
                this.notFound = true
              }
          });
  }

  goProductDetail(id: any) {
      this
          .router
          .navigate(['base/', id]);
          // location.reload();
  }

  getCompareCategory(category: any): void {
      this
          .categoryService
          .getCategoryCompare(category)
          .subscribe((category: any) => {
              let status = category['kitchenart']['status'];
              this.statusCategory = category['kitchenart']['status']['code'];
              if (status['code'] != 404) {
                  this.category = category['kitchenart']['results'];
              }
          })
    }

    getCategoryChild(): void {
        const url = this.route.snapshot.paramMap.get('url');
        this.categoryService
            .getCategoryByChild(url)
            .subscribe((child: any) => {
                this.categories = child['kitchenart']['results'];
                this.countCat = this.categories.length;
                if (this.countCat > 0) {
                    this.title_english = this.categories[0]['parent_name_english'];
                    this.title_indonesia = this.categories[0]['parent_name_indonesia'];
                }
            });
    }

    goLink(link: any): void {
        this
            .router
            .navigate(['category/' + link]);
        setTimeout(() => {
            location.reload();
        }, 2000)
    }

    getCompare(url: any) {
        this
            .router
            .navigate(['compare/', url]);
    }

//   @HostListener('scroll', ['$event'])
//     onScroll(event: any): void {
//         const isMobile = this.deviceService.isMobile();
//         const isTablet = this.deviceService.isTablet();
//         if(isMobile){
//             if ((event.srcElement.scrollTop) >= (680 * this.page)) {
//                 this.offset = this.offset + this.limit;
//                     const category = this
//                     .route
//                     .snapshot
//                     .paramMap
//                     .get('category');
//                 const publish = 'T';
//                 const sidx = 'id';
//                 const sort = 'asc';
//                 const limit = this.limit;
//                 const offset = this.offset;
    
//                 this
//                     .productService
//                     .getProductByCategory(category, publish, sidx, sort, limit, offset, this.token)
//                     .subscribe((product: any) => {
//                         this.arrayProducts = this.arrayProducts.concat(product['kitchenart']['results']);
//                         this.products = this.arrayProducts
//                     });
//                 this.page++;
                
//             }
//         }
//         else if(isTablet){
//             if ((event.srcElement.scrollTop) >= (875 * this.page)) {
//                 this.offset = this.offset + this.limit;
//                     const category = this
//                     .route
//                     .snapshot
//                     .paramMap
//                     .get('category');
//                 const publish = 'T';
//                 const sidx = 'id';
//                 const sort = 'asc';
//                 const limit = this.limit;
//                 const offset = this.offset;
    
//                 this
//                     .productService
//                     .getProductByCategory(category, publish, sidx, sort, limit, offset, this.token)
//                     .subscribe((product: any) => {
//                         this.arrayProducts = this.arrayProducts.concat(product['kitchenart']['results']);
//                         this.products = this.arrayProducts
//                     });
//                 this.page++;
                
//             }
//         }
//     }

}
