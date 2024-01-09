import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { ProductService } from '../../../service/product/product.service';
import { Meta, Title } from '@angular/platform-browser';
import { TermService } from '../../../service/term/term.service';
import * as CryptoJS from 'crypto-js';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-product-promo',
  templateUrl: './product-promo.component.html',
  styleUrls: ['./product-promo.component.css']
})

export class ProductPromoComponent implements OnInit {
  text:any = {
    Year: 'Y',
    Month: ':',
    Weeks: ":",
    Days: ":",
    Hours: ":",
    Minutes: ":",
    Seconds: "",
    MilliSeconds: "MS"
  };

  page: number = 1;
  limit: number = 10;
  offset: number = 0;

  products: Array<any> = [];
  arrayProducts: Array<any> = []

  day: number;
  hours: number;
  minutes: number;
  seconds: number;
  url: string;
  metaTag: any;

  discount: boolean
  key: any = "WUTWd0kSuptXpHkf1pQcmIl5C3NNI1m6";
  token: any;
  navigationSubscription: any;
  dateEnd: any;
  count: number = 0

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private termService : TermService,
    private meta : Meta,
    private titleService: Title,
    private localSt: LocalStorageService
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
        if (e instanceof NavigationEnd) {
          this.initialiseInvites();
        }
    });
    this.route.params.subscribe((params: any) => {
      setTimeout(() => {
        this.url = params['url'];
        if(this.url == 'deal_zone'){
          this.getDealZone();
          this.discount = true
          this.titleService.setTitle('KitchenArt - Deal Zones');
        }    
        else if(this.url == 'sale_item'){
          this.getSaleItem();
          this.discount = true
          this.titleService.setTitle('KitchenArt - Sale & Clearence');
        } 
        else if(this.url == 'best_seller'){
          this.getBestseller();
          this.discount = false
          this.titleService.setTitle('KitchenArt - Best Seller');
        } 
        else if(this.url == 'top_picks'){
          this.getTopPicks();
          this.discount = false
          this.titleService.setTitle('KitchenArt - Top Picks');
        } 
        else if(this.url == 'new_collection'){
          this.getNewCollection();
          this.discount = false
          this.titleService.setTitle('KitchenArt - New Collection');
        } 
        else if(this.url == 'pre_order'){
          this.getPreOrder();
          this.discount = false
          this.titleService.setTitle('KitchenArt - Pre Order');
        } 
        else if(this.url == 'hot_deals') {
          this.getHotSpectacular();
          this.discount = true
          this.titleService.setTitle('KitchenArt - Hot Spectacular');
        }
      }, 3000)
    })
    this.getMeta()
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
  }

  getDealZone(): void {
    this.count = 0
    const sidx = 'id';
    const sort = 'asc';
    const limit = 0;
    const offset = 0;
    
    this.productService.getProductDealZones(sidx, sort, limit, offset, this.token)
    .subscribe((product: any) => {
      this.products = product['kitchenart']['results']
      if(this.products.length > 0) {
        this.dateEnd = this.products[0]['date_end']
      }   
      this.count = this.products.length
    });
  }

  getSaleItem(): void {
    this.count = 0
    const sidx = 'id';
    const sort = 'asc';
    const limit = 0;
    const offset = 0;
    
    this.productService.getProductSaleItems(sidx, sort, limit, offset, this.token)
    .subscribe((product: any) => {
      this.products = product['kitchenart']['results']
      this.count = this.products.length
    });
  }

  getHotSpectacular(): void {
    this.count = 0
    const sidx = 'id';
    const sort = 'asc';
    const limit = 0;
    const offset = 0;
   
    this.productService.getProductHotSpectacular(sidx, sort, limit, offset, this.token)
    .subscribe((product: any) => {
      this.products = product['kitchenart']['results']
      this.count = this.products.length
    });
  }

  getBestseller(): void {
      this.count = 0
      const sidx = 'id';
      const sort = 'asc';
      const limit = 0;
      const offset = 0;
      this
          .productService
          .getProductBestSeller(sidx, sort, limit, offset, this.token)
          .subscribe((product: any) => {
            this.products = product['kitchenart']['results']
            this.count = this.products.length
          });
  }

  getTopPicks(): void {
      this.count = 0
      const sidx = 'id';
      const sort = 'asc';
      const limit = 0;
      const offset = 0;
      this
          .productService
          .getProductTopPicks(sidx, sort, limit, offset, this.token)
          .subscribe((product: any) => {
            this.products = product['kitchenart']['results']
            this.count = this.products.length
          });
  }

  getNewCollection(): void {
      this.count = 0
      const sidx = 'id';
      const sort = 'asc';
      const limit = 0;
      const offset = 0;
      this
          .productService
          .getProductNewCollection(sidx, sort, limit, offset, this.token)
          .subscribe((product: any) => {
            this.products = product['kitchenart']['results']
            this.count = this.products.length
          });
  }

  getPreOrder(): void {
      this.count = 0
      const sidx = 'id';
      const sort = 'asc';
      const limit = 0;
      const offset = 0;
      this
          .productService
          .getProductPreOrder(sidx, sort, limit, offset, this.token)
          .subscribe((product: any) => {
            this.products = product['kitchenart']['results']
            this.count = this.products.length
          });
  }

  goProductDetail(url: any) {
      this.router.navigate(['base/', url]);
      setTimeout(() => {
        location.reload();
      }, 3000);
      // location.reload();
  }
}
