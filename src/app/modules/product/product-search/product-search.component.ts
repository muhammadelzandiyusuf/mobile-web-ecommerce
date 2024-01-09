import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';

import { ProductService } from '../../../service/product/product.service';
import { Meta, Title } from '@angular/platform-browser';
import { TermService } from '../../../service/term/term.service';
import { CategoryService } from '../../../service/category/category.service';
import { BrandService } from '../../../service/brand/brand.service';
import { OrderPipe } from 'ngx-order-pipe';
import { OrderByPipe } from '../../../filter/order-pipe/order.pipe';
import { Brand } from '../../../service/brand/brand';
import { Category } from '../../../service/category/category';
import { LocalStorageService } from 'ngx-webstorage';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent implements OnInit {

    public formModal = false;
    public formModalBrand = false;
    public formModalSortby = false;

    page: number = 1;
    limit: number = 10;
    offset: number = 0;

    products: Array<any> = [];
    arrayProducts: Array<any> = []
    result: string;
    metaTag: any;

    categories: Category[];
    brands: Brand[];
    filterCategory: any;
    name: string;
    filterArr: any = [];
    filterBrandArr: any = [];

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
    lang: any;
    key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
    token: any;
    navigationSubscription: any;
    statusCode: number = 0;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private productService: ProductService,
        private termService : TermService,
        private meta : Meta,
        private titleService: Title,
        private categoryService : CategoryService,
        private brandService : BrandService,
        private orderPipe : OrderPipe,
        private orderByPipe : OrderByPipe,
        private localSt: LocalStorageService,
        private deviceService: DeviceDetectorService
    ) { 
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            if (e instanceof NavigationEnd) {
              this.initialiseInvites();
            }
        });
        this.route.queryParams.subscribe((params: any) => {
            let param = params['search'];
            this.result = param;
            this.titleService.setTitle('KitchenArt - Product ' + param);
        });
        this.getMeta()
    }

    initialiseInvites() { 
        this.lang = this.localSt.retrieve('lang');
        let token = this.localSt.retrieve('token');
        if(token){
            this.token = CryptoJS.AES.decrypt(token, this.key).toString(CryptoJS.enc.Utf8);
        }
        setTimeout(() => {
            this.getProduct(this.result);
        }, 3000)
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

    closeModal(): void {
        this.formModal = false;
        this.formModalBrand = false;
        this.formModalSortby = false;
    }

    getFilterBrand(): void {
        this.formModalBrand = true;
    }

    getFilterSortby(): void {
        this.formModalSortby = true;
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

    getCategoryFilter(): void {
        const publish = 'T';
        const sidx = 'position';
        const sort = 'asc';
    
        this.categoryService.getCategories(publish, sidx, sort)
        .subscribe((category: any) => {
          this.categories = category['kitchenart']['results'];
        });
    }

    ngOnInit() {
        // this.getBrand()
        // this.getCategoryFilter()
    }

    getProduct(search: any): void {
        const limit = 0;
        const offset = 0;

        this.productService.getProductSearch(search, limit, offset, this.token)
        .subscribe((product: any) => {
        this.arrayProducts = product['kitchenart']['results']['products'];
        this.products = product['kitchenart']['results']['products']
        this.statusCode = product['kitchenart']['status']['code']
        this.brands = product['kitchenart']['results']['filter_brand']
        this.categories = product['kitchenart']['results']['filter_category']
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
    //         if (event.srcElement.scrollTop >= (836 * this.page)) {
    //             this.offset = this.offset + this.limit;
    //             const limit = this.limit;
    //             const offset = this.offset;
    
    //             this.productService.getProductSearch(this.result, limit, offset, this.token)
    //             .subscribe((product: any) => {
    //                 this.arrayProducts = this.arrayProducts.concat(product['kitchenart']['results']['products']);
    //                 this.products = this.arrayProducts
    //             });
    //             this.page++;
    //         }
    //     }
    //     else if(isTablet){
    //         if (event.srcElement.scrollTop >= (930 * this.page)) {
    //             this.offset = this.offset + this.limit;
    //             const limit = this.limit;
    //             const offset = this.offset;
    
    //             this.productService.getProductSearch(this.result, limit, offset, this.token)
    //             .subscribe((product: any) => {
    //                 this.arrayProducts = this.arrayProducts.concat(product['kitchenart']['results']['products']);
    //                 this.products = this.arrayProducts
    //             });
    //             this.page++;
    //         }
    //     }
    // }

}
