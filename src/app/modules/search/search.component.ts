import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TermService } from '../../service/term/term.service';
import { Meta, Title } from '@angular/platform-browser';
import { ProductService } from '../../service/product/product.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Location } from '@angular/common';
import * as CryptoJS from 'crypto-js';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  metaTag: any;
  search: any;
  brands: any;
  products: any;
  textSearch: string;
  countProduct: any;
  offset: number;
  limit: number;
  navigationSubscription: any;
  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  token: string;

  constructor(
    private router: Router,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title,
    private productService: ProductService,
    private deviceService: DeviceDetectorService,
    private location: Location,
    private localSt:LocalStorageService
  ) { 
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
    this.getMeta()
    this.titleService.setTitle('KitchenArt - Search Product');
  }

  initialiseInvites() {
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
      const isMobile = this.deviceService.isMobile();
      const isTablet = this.deviceService.isTablet();
      if(isMobile){
        this.limit = 2;
        this.offset = 0;
      }
      else if(isTablet){
        this.limit = 3;
        this.offset = 0;
      }
  }

  back() {
    this.location.back();
  }

  onEnter(value: string) {
    this.router.navigate(['/search/result'], { queryParams: { search: value } });
  }

  goProductDetail(id: any) {
    this.router.navigate(['base/', id]);
    setTimeout(() => {
      location.reload();
    }, 3000);
  }

  onSearchChange(searchValue : string) {
      this.textSearch = searchValue;
      this.productService.getProductSearchAuto(searchValue, this.limit, this.offset, this.token)
        .subscribe((product: any) => {
        this.search = product['kitchenart']['results']
        this.brands = this.search['brands']
        this.products = this.search['products']
        this.countProduct = this.search['count_product']

        if(searchValue == ''){
          this.brands  = []
          this.products = []
        }
      });
  }
}
