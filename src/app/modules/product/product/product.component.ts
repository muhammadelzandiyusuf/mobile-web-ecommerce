import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";

import { Product } from '../../../service/product/product';
import { ProductService } from '../../../service/product/product.service';
import { Brand } from '../../../service/brand/brand';
import { BrandService } from '../../../service/brand/brand.service';
import { Category } from '../../../service/category/category';
import { CategoryService } from '../../../service/category/category.service';

import { Meta, Title } from '@angular/platform-browser';
import { TermService } from '../../../service/term/term.service';
import { LocalStorageService } from 'ngx-webstorage';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  config: any = {
      paginationClickable: true,
      centeredSlides: true,
      autoplay: 2500,
      autoplayDisableOnInteraction: false,

      mousewheelControl: true,
      keyboardControl: true,
      direction: 'horizontal',
      preloadImages: true,
      updateOnImagesReady: true
  };

  products: Product[];
  brands: Brand[];
  categories: Category[];
  group: string;

  today = Date.now();
  metaTag: any;
  lang: any;
  token: any;
  navigationSubscription: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private brandService: BrandService,
    private categoryService: CategoryService,
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
      this.route.params.subscribe((params: any) => {
        setTimeout(() => {
          this.group = params['group']
          if (params['group'] == 'category') { 
            this.getCategoryParent();
          } else {
            this.getBrand();
          }
        })
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
    this.getProduct();
    this.titleService.setTitle('KitchenArt - Product');
  }

  getProduct(): void {
    const publish = 'T';
    const sidx = 'id';
    const sort = 'desc';
    let limit = 20;
    const isTablet = this.deviceService.isTablet();
    if(isTablet){
      limit = 21;
    }
    let start = 0;

    this.productService.getProductList(publish, sidx, sort, limit ,start, this.token)
    .subscribe((product: any) => {
      this.products = product['kitchenart']['results'];
    });
  }

  getBrand(): void {
    const publish = 'T';
    const navbaronly = 'F';
    const sidx = 'position';
    const sort = 'asc';

    this.brandService.getBrands(publish, navbaronly, sidx, sort)
    .subscribe((brand: any) => {
      this.brands = brand['kitchenart']['results'];
    });
  }

  getCategoryParent(): void {
    const parent = '';
    const publish = 'T';
    const sidx = 'parent';
    const sort = 'desc';

    this.categoryService.getCategoryByParent(parent, publish, sidx, sort)
    .subscribe((category: any) => {
      this.categories = category['kitchenart']['results'];
    });
  }

  goLink(link: any): void {
    this.router.navigate(['category/' + link]);  
  }

  goProduct(group:string) {
    this.router.navigate(['product/', group]);
  }

  goProductDetail(id: any) {
    this.router.navigate(['base/', id]);
    setTimeout(() => {
      location.reload();
    }, 3000);
    // location.reload();
  }

  goProductBrand(brand: any): void {
    this.router.navigate(['brand/', brand]); 
  }

}
