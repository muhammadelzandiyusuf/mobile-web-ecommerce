import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { ProductService } from '../../../service/product/product.service';
import { Meta, Title } from '@angular/platform-browser';
import { TermService } from '../../../service/term/term.service';
import * as CryptoJS from 'crypto-js';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-product-promo',
  templateUrl: './product-event.component.html',
  styleUrls: ['./product-event.component.css']
})

export class ProductEventComponent implements OnInit {
  limit: number = 10;
  offset: number = 0;

  products: Array<any> = [];
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
  }

  initialiseInvites() { 
    let token = this.localSt.retrieve('token');
    if(token){
        this.token = CryptoJS.AES.decrypt(token, this.key).toString(CryptoJS.enc.Utf8);
    }

    setTimeout(() => {
        this.getSaleEvent();
        this.discount = true
        this.getMeta()
    }, 5000)
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

  getSaleEvent(): void {
    this.count = 0
    const sidx = 'id';
    const sort = 'asc';
    const limit = 0;
    const offset = 0;
    
    this.productService.getProductSaleEvents(sidx, sort, limit, offset, this.token)
    .subscribe((product: any) => {
      this.products = product['kitchenart']['results']
      this.count = this.products.length
      this.titleService.setTitle('KitchenArt - ' + this.products[0].sale_event_name);
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